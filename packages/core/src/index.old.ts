import AnyTouch from 'any-touch'
import raf from 'raf';
import debounce from 'lodash/debounce';

import clamp from 'lodash/clamp';
import createBar from '@any-scroll/bar';
import { setStyle, easeOutCubic, setTranslate, delay, nextTick } from '@any-scroll/shared';
import watchWheel from './wheel';
import { STYLE, CONTENT_STYLE, SHRINK_DELAY_TIME, CLASS_NAME_ANY_SCROLL } from './const';
const { setTimeout } = window;

declare const WebKitMutationObserver: MutationObserver;
declare const MozMutationObserver: MutationObserver;
declare global {
    interface Window {
        __SCROLL_VIEW__MAP: any
    }
}
// 全局注册
window.__SCROLL_VIEW__MAP = window.__SCROLL_VIEW__MAP || new WeakMap();

export default function (el: HTMLElement, { tolerance = 150, damping = 0.1 } = {}) {
    // 内容元素当前位移
    let __x = 0;
    let __y = 0;
    // 给按距离滚动的函数使用
    // 给按时间和距离滚动的函数使用
    let __rafId = -1;
    let __rafIdXY = [-1, -1];

    let __minXY = [0, 0];
    let __contentSize = [0, 0];

    let __isScrolling = [false, false];

    let isAnimateScrollStop = [true, true];

    // 设置外容器样式
    setStyle(el, STYLE);
    el.classList.add(CLASS_NAME_ANY_SCROLL);
    // 生成内容器, 并把外容器内的dom移动到内容器
    const contentEl = document.createElement('div');
    while (el.firstChild) {
        contentEl.appendChild(el.firstChild);
    }
    // 设置内容器样式
    setStyle(contentEl, CONTENT_STYLE);
    el.appendChild(contentEl);

    const __updateBar = createBar(el, (x, y, thumbWidth, thumbHeight) => {
        __setXY(
            x / (el.clientWidth - thumbWidth) * __minXY[0],
            y / (el.clientHeight - thumbHeight) * __minXY[1]);
    });



    watchWheel(el, ({ type, deltaY, v, target }) => {
        if ('start' === type) {
            __stop();
        } else if ('move' === type) {
            __setXY(__x, __y + deltaY * 2);
        } else if ('end' === type) {
            if (5 < Math.abs(v)) {
                __scrollTo([__x, __y + v * 200])
            } else {
                __snap()
            }
        }
    });


    __updateSize();
    // 要__updateBar要放在__updateSize后
    __updateBar([__x, __y], [el.clientWidth, el.clientHeight, __minXY[0], __minXY[1]]);
    __registerObserver();

    // 加载手势
    const at = new AnyTouch(el);

    at.on('panstart', e => {
        const { deltaX, deltaY } = e;
        const is = (e.target as HTMLElement).classList.contains('scroll-bar-track') ||
            (e.target as HTMLElement).classList.contains('scroll-bar-thumb')
        if (!is) {
            __setXY(__x + deltaX, __y + deltaY);
        }
    });

    at.on('panmove', e => {
        const { deltaX, deltaY } = e;
        const is = (e.target as HTMLElement).classList.contains('scroll-bar-track') ||
            (e.target as HTMLElement).classList.contains('scroll-bar-thumb')
        if (!is) {
            __setXY(__x + deltaX, __y + deltaY);
        }
    });

    let id = 0;
    at.on('panend', e => {
        id = setTimeout(() => {
            __onScrollEnd();
        }, SHRINK_DELAY_TIME)
    })

    at.on('at:end', e => {
        __snap();
    });

    at.on('at:start', e => {
        __stop();
    });

    const swipe = at.get('swipe');
    swipe && swipe.set({ velocity: 1 });
    at.on('swipe', e => {
        clearTimeout(id)
        let deltaX = e.speedX * 30;
        let deltaY = e.speedY * 30;
        __scrollTo([__x + deltaX, __y + deltaY]);
    });

    /**
     * 设置xy
     * @param distXY 目标点
     * @returns 返回当前xy 
     */
    function __setXY(x: number, y: number): [number, number] {
        const distX = clamp(x, __minXY[0] - tolerance, tolerance);
        const distY = clamp(y, __minXY[1] - tolerance, tolerance);

        __isScrolling = [__x !== x, __y !== y];

        // 同步
        __x = distX;
        __y = distY;

        const distXY: [number, number] = [__x, __y];

        // 钩子
        __onScroll(distXY, [__minXY[0], __minXY[1]]);
        setTranslate(contentEl, __x, __y);
        return distXY;
    }

    function __nextTick(from: number, to: number, callback: (value: number, rafId: number) => void) {
        nextTick(to - from, (n, rafId) => {
            callback(from + n, rafId);
        }, damping);
    }


    /**
     * 更新尺寸
     */
    function __updateSize() {
        // 保留边框
        // 参考smooth-scroll
        __contentSize[0] = contentEl.offsetWidth - contentEl.clientWidth + contentEl.scrollWidth;
        __contentSize[1] = contentEl.offsetHeight - contentEl.clientHeight + contentEl.scrollHeight;
        __minXY[0] = el.clientWidth - __contentSize[0];
        __minXY[1] = el.clientHeight - __contentSize[1];
        console.log('update-size', el.id, { CONTENT_WIDTH: __contentSize[0], MIN_X: __minXY[0], CONTENT_HEIGHT: __contentSize[1], MIN_Y: __minXY[1] });
    }

    /**
     * 监听所有的滚动
     * 用来扩展插件
     * @param param0 
     */
    function __onScroll([x, y]: [number, number], [minX, minY]: [number, number]) {
        // __isScrolling = true;
        __updateBar([x, y], [el.clientWidth, el.clientHeight, minX, minY]);
    }


    function __onScrollEnd() {
        // __isScrolling = false;
        console.log(`__onScrollEnd`);
    }

    /**
     * 注册监听
     */
    function __registerObserver() {
        window.addEventListener('resize', __updateSize);
        const Observer = MutationObserver || WebKitMutationObserver || MozMutationObserver;
        // observe
        if (typeof Observer === 'function') {
            const ob = new Observer(__updateSize);
            ob.observe(contentEl, {
                subtree: true,
                childList: true,
            });
        }
    }

    function __stop() {
        raf.cancel(__rafId);
        raf.cancel(__rafIdXY[0]);
        raf.cancel(__rafIdXY[1]);
    }

    function __snap() {
        __scrollTo([clamp(__x, __minXY[0], 0), clamp(__y, __minXY[1], 0)]);
    }




    /**
     * 手势对应的滚动逻辑
     * 和对外的scrollTo的区别是:与时间无关的迭代衰减
     * @param distXY 目标点
     * @param onScroll 滚动回调
     * @param isShrink 是否收缩滚动, 用来防止回滚中再次执行回滚
     */
    function __scrollTo(
        [distX, distY]: [number, number],
        onScroll = (([x, y]: [number, number]) => void 0),
        isShrink = [false, false],
    ) {
        // y轴变化,也会触发scrollTo, 
        // 如果x==distX, 
        // 说明x轴不动
        clearTimeout(id)
        let dist = [distX, distY];
        let realDist = [distX, distY];
        let isOut = [false, false];

        let __xy = [__x, __y];


        for (let i = 0; i < 2; i++) {
            console.log({ i });
            if (__xy[i] !== dist[i]) {
                raf.cancel(__rafIdXY[i]);
                const startValue = __xy[i];
                // 容差范围内的dist[i]
                realDist[i] = clamp(dist[i], __minXY[i] - tolerance, tolerance);
                isOut[i] = __xy[i] >= 0 && __xy[i] <= __minXY[i];
                __nextTick(startValue, realDist[i], (newValue, rafId) => {
                    const currentValue = newValue;

                    isAnimateScrollStop[i] = newValue === realDist[i];
                    if (isAnimateScrollStop.every(is => is) && !isOut[0] && !isOut[1]) {
                        __onScrollEnd()
                    }

                    __rafIdXY[i] = rafId;
                    const newXY = [__x, __y];
                    newXY[i] = newValue;
                    const _xy = __setXY(newXY[0], newXY[1]);

                    onScroll(_xy);

                    if (!isShrink[i]) {
                        // 准备收缩
                        const isShrinks = [isShrink[0], isShrink[1]];
                        isShrinks[i] = true;

                        if (0 < currentValue) {
                            delay(() => {
                                const toXY: [number, number] = [__x, __y];

                                toXY[i] = 0;
                                __scrollTo(toXY, onScroll, isShrinks);
                            });
                        } else if (__minXY[i] > currentValue) {
                            delay(() => {
                                const toXY: [number, number] = [__x, __y];
                                toXY[i] = __minXY[i];
                                __scrollTo(toXY, onScroll, isShrinks);
                            });
                        }
                    }


                });
            }
        }

        // if (__x !== distX) {
        //     raf.cancel(__rafIdXY[0]);
        //     // 容差范围内的distX
        //     realDist[0] = clamp(distX, __minXY[0] - tolerance, tolerance);
        //     isOut[0] = __x >= 0 && __x <= __minXY[0];

        //     __nextTick(__x, realDist[0], (newValue, rafId) => {
        //         isAnimateScrollStop[0] = newValue === realDist[0];
        //         if (isAnimateScrollStop.every(is => is) && isOut.every(is => !is)) {
        //             __onScrollEnd()
        //         }

        //         __rafIdXY[0] = rafId;
        //         const _xy = __setXY(newValue, __y);

        //         onScroll(_xy);

        //         if (!isShrink[0]) {
        //             let __isShrinks = [isShrink[0], isShrink[1]];
        //             __isShrinks[0] = true;

        //             // 准备收缩
        //             if (0 < newValue) {
        //                 delay(() => {
        //                     let to: [number, number] = [__x, __y];
        //                     to[0] = 0;
        //                     __scrollTo(to, onScroll, __isShrinks);
        //                 });
        //             } else if (__minXY[0] > newValue) {
        //                 delay(() => {
        //                     let to: [number, number] = [__x, __y];
        //                     to[0] = __minXY[0]
        //                     __scrollTo(to, onScroll, __isShrinks);
        //                 });
        //             }
        //         }
        //     });
        // }


        // if (__y !== distY) {
        //     // 关闭前一个未完成的滚动动画
        //     raf.cancel(__rafIdXY[1])
        //     // 容差范围内
        //     realDist[1] = clamp(distY, __minXY[1] - tolerance, tolerance)
        //     isOut[1] = __y >= 0 && __y <= __minXY[1];

        //     __nextTick(__y, realDist[1], (newValue, rafId) => {

        //         isAnimateScrollStop[1] = newValue === realDist[1];
        //         if (isAnimateScrollStop.every(is => is) && isOut.every(is => !is)) {
        //             __onScrollEnd()
        //         }
        //         __rafIdXY[1] = rafId;
        //         const _xy = __setXY(__x, newValue);
        //         onScroll(_xy);
        //         if (!isShrink[1] && 0 < newValue) {
        //             // 收缩
        //             delay(() => {
        //                 __scrollTo([__x, 0], onScroll, [isShrink[0], true]);
        //             });
        //         } else if (!isShrink[1] && __minXY[1] > newValue) {
        //             delay(() => {
        //                 __scrollTo([__x, __minXY[1]], onScroll, [isShrink[0], true]);
        //             });
        //         } else {

        //         }
        //     });
        // }
    }

    /**
     * 按时间滚动
     * @param distX 
     * @param distY 
     * @param duration 
     * @param done 
     */
    function scrollTo(distX: number, distY: number, duration: number, done?: () => void) {
        raf.cancel(__rafId);
        const startTime = Date.now();
        const distanceX = clamp(0 - distX, __minXY[0], 0) - __x;
        const distanceY = clamp(0 - distY, __minXY[1], 0) - __y;
        __scrollToOnTime([__x, __y], [distanceX, distanceY], startTime, duration);
    }

    function __scrollToOnTime([startX, startY]: [number, number], [distanceX, distanceY]: [number, number], startTime: number, duration: number) {
        const elapse = Date.now() - startTime;
        const progress = Math.min(1, easeOutCubic(elapse / duration));
        const distX = startX + distanceX * progress;
        const distY = startY + distanceY * progress;

        if (duration >= elapse) {
            __setXY(distX, distY);
            __rafId = raf(() => {
                __scrollToOnTime([startX, startY], [distanceX, distanceY], startTime, duration);
            });
        } else {
            __onScrollEnd();
        }
    }
    return [scrollTo];
}