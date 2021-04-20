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
    let __rafIdX = -1;
    let __rafIdY = -1;
    // 给按时间和距离滚动的函数使用
    let __rafId = -1;

    let __MIN_X = 0;
    let __MIN_Y = 0;
    let __CONTENT_WIDTH = 0;
    let __CONTENT_HEIGHT = 0;

    let __isScrolling = [false, false];

    let isAnimateScrollStopX = true;
    let isAnimateScrollStopY = true;



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
            x / (el.clientWidth - thumbWidth) * __MIN_X,
            y / (el.clientHeight - thumbHeight) * __MIN_Y);
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
    __updateBar([__x, __y], [el.clientWidth, el.clientHeight, __MIN_X, __MIN_Y]);
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
        }, 200)
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
        const distX = clamp(x, __MIN_X - tolerance, tolerance);
        const distY = clamp(y, __MIN_Y - tolerance, tolerance);

        __isScrolling = [__x !== x, __y !== y];

        // 同步
        __x = distX;
        __y = distY;

        const distXY: [number, number] = [__x, __y];

        // 钩子
        __onScroll(distXY, [__MIN_X, __MIN_Y]);
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
        __CONTENT_WIDTH = contentEl.offsetWidth - contentEl.clientWidth + contentEl.scrollWidth;
        __CONTENT_HEIGHT = contentEl.offsetHeight - contentEl.clientHeight + contentEl.scrollHeight;
        __MIN_X = el.clientWidth - __CONTENT_WIDTH;
        __MIN_Y = el.clientHeight - __CONTENT_HEIGHT;
        console.log('update-size', el.id, { CONTENT_WIDTH: __CONTENT_WIDTH, MIN_X: __MIN_X, CONTENT_HEIGHT: __CONTENT_HEIGHT, MIN_Y: __MIN_Y });
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
        raf.cancel(__rafIdX);
        raf.cancel(__rafIdY);
    }

    function __snap() {
        __scrollTo([clamp(__x, __MIN_X, 0), clamp(__y, __MIN_Y, 0)]);
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
        let realDistX = distX;
        let realDistY = distY;


        if (__x !== distX) {
            raf.cancel(__rafIdX);
            const startX = __x;
            // 容差范围内的distX
            realDistX = clamp(distX, __MIN_X - tolerance, tolerance);

            __nextTick(startX, realDistX, (newX, rafId) => {
                const currentX = newX;


                isAnimateScrollStopX = newX === realDistX;
                if (isAnimateScrollStopX && isAnimateScrollStopY) {
                    __onScrollEnd()
                }

                __rafIdX = rafId;
                const _xy = __setXY(newX, __y);

                onScroll(_xy);

                if (!isShrink[0]) {
                    // 准备收缩
                    if (0 < currentX) {
                        delay(() => {
                            __scrollTo([0, __y], onScroll, [true, isShrink[1]]);
                        });
                    } else if (__MIN_X > currentX) {
                        delay(() => {
                            __scrollTo([__MIN_X, __y], onScroll, [true, isShrink[1]]);
                        });
                    }
                }


            });
        }


        if (__y !== distY) {
            // 关闭前一个未完成的滚动动画
            raf.cancel(__rafIdY)
            const startY = __y;
            // 容差范围内
            realDistY = clamp(distY, __MIN_Y - tolerance, tolerance)
            __nextTick(startY, realDistY, (newY, rafId) => {
                const currentY = newY;

                isAnimateScrollStopY = newY === realDistY;
                if (isAnimateScrollStopX && isAnimateScrollStopY) {
                    __onScrollEnd()
                }


                __rafIdY = rafId;
                const _xy = __setXY(__x, newY);

                if (!isShrink[1] && 0 < currentY) {
                    // 收缩
                    delay(() => {
                        __scrollTo([__x, 0], onScroll, [isShrink[0], true]);
                    });
                } else if (!isShrink[1] && __MIN_Y > currentY) {
                    delay(() => {
                        __scrollTo([__x, __MIN_Y], onScroll, [isShrink[0], true]);
                    });
                } else {

                }
            });
        }
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
        const distanceX = clamp(0 - distX, __MIN_X, 0) - __x;
        const distanceY = clamp(0 - distY, __MIN_Y, 0) - __y;
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