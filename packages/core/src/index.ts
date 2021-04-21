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




let isAnimateScrollStopX = true;
let isAnimateScrollStopY = true;
let __rafIdX = -1;
let __rafIdY = -1;

/**
 * 构造DOM结构
 * @param el 外壳元素
 * @returns 内部容器元素
 */
function __initDOM(el: HTMLElement): HTMLElement {
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
    return contentEl;
}

interface Options { tolerance: number, damping: number };
const DEFAULT_OPTIONS = { tolerance: 100, damping: 0.1 };

export default class extends AnyTouch {
    private __xy: [number, number] = [0, 0];
    private __rafIdXY: [number, number] = [-1, -1];
    // 给按时间和距离滚动的函数使用
    private __rafId = -1;
    private __minXY: [number, number] = [0, 0];
    private __contentSize: [number, number] = [0, 0];
    private __isAnimateScrollStop: [boolean, boolean] = [true, true];
    private __options: Options;
    __updateBar: any;
    el: HTMLElement;
    contentEl: HTMLElement;
    id = -1;

    constructor(el: HTMLElement, options?: Options) {
        super(el);
        this.el = el;
        this.contentEl = __initDOM(el);
        this.__options = { ...options, ...DEFAULT_OPTIONS };
        this.__updateBar = createBar(el, (x, y, thumbWidth, thumbHeight) => {
            this.__setXY(
                x / (el.clientWidth - thumbWidth) * this.__minXY[0],
                y / (el.clientHeight - thumbHeight) * this.__minXY[1]);
        });
        this.__updateSize();


        this.on('panmove', e => {
            const { deltaX, deltaY } = e;
            const is = (e.target as HTMLElement).classList.contains('scroll-bar-track') ||
                (e.target as HTMLElement).classList.contains('scroll-bar-thumb')
            if (!is) {

                this.__setXY(this.__xy[0] + deltaX, this.__xy[1] + deltaY);
            }
        });


        this.on('panend', e => {
            this.id = setTimeout(() => {
                // __onScrollEnd();
            }, SHRINK_DELAY_TIME)
        })

        this.on('at:end', e => {
            this.__snap();
        });

        this.on('at:start', e => {
            this.__stop();
        });




        const swipe = this.get('swipe');
        swipe && swipe.set({ velocity: 1 });
        this.on('swipe', e => {
            clearTimeout(this.id)
            let deltaX = e.speedX * 30;
            let deltaY = e.speedY * 30;
            this.__scrollTo([this.__xy[0] + deltaX, this.__xy[1] + deltaY]);
        });

    }



    __stop() {
        raf.cancel(this.__rafId);
        raf.cancel(__rafIdX);
        raf.cancel(__rafIdY);
    }

    __snap() {
        this.__scrollTo([clamp(this.__xy[0], this.__minXY[0], 0), clamp(this.__xy[1], this.__minXY[1], 0)]);
    }



    private __setXY(x: number, y: number): [number, number] {
        const distX = clamp(x, this.__minXY[0] - this.__options.tolerance, this.__options.tolerance);
        const distY = clamp(y, this.__minXY[1] - this.__options.tolerance, this.__options.tolerance);

        // __isScrolling = [this.__xy[0] !== x, this.__xy[1] !== y];

        // 同步
        this.__xy = [distX, distY];

        // 钩子
        this.emit('scroll', this.__xy);
        const { clientWidth, clientHeight } = this.el;
        this.__updateBar([x, y], [clientWidth, clientHeight, ...this.__minXY]);
        setTranslate(this.contentEl, ...this.__xy);
        return this.__xy;
    }

    /**
     * 手势对应的滚动逻辑
     * 和对外的scrollTo的区别是:与时间无关的迭代衰减
     * @param distXY 目标点
     * @param onScroll 滚动回调
     * @param isShrink 是否收缩滚动, 用来防止回滚中再次执行回滚
     */
    private __scrollTo2(
        distXY: [number, number],
        onScroll = (([x, y]: [number, number]) => void 0),
        isShrink = [false, false],
    ) {
        // y轴变化,也会触发scrollTo, 
        // 如果x==distX, 
        // 说明x轴不动
        clearTimeout(this.id)
        let realDistXY = distXY;
        let isOutXY = [false, false];
        const { tolerance } = this.__options;
        for (let i = 0; i < 2; i++) {

            if (this.__xy[i] !== distXY[i]) {
                // 关闭前一个未完成的滚动动画
                raf.cancel(this.__rafIdXY[i])
                const start = this.__xy[i];
                // 容差范围内
                realDistXY[i] = clamp(distXY[i], this.__minXY[i] - tolerance, tolerance)
                isOutXY[i] = this.__xy[i] >= 0 && this.__xy[i] <= this.__minXY[i];

                __nextTick(start, realDistXY[i], (newValue, rafId) => {
                    const currentValue = newValue;

                    this.__isAnimateScrollStop[i] = newValue === realDistXY[i];
                    if (this.__isAnimateScrollStop[0] && this.__isAnimateScrollStop[1] && !isOutXY[0] && !isOutXY[1]) {
                        // __onScrollEnd()
                        this.emit('scroll-end', this.__xy);
                    }


                    this.__rafIdXY[i] = rafId;

                    const newXY: [number, number] = [...this.__xy];
                    newXY[i] = newValue;

                    const _xy = this.__setXY(...newXY);

                    if (!isShrink[i] && 0 < currentValue) {
                        // 收缩
                        delay(() => {
                            const to: [number, number] = [...this.__xy];
                            const shrinkList = [...isShrink];
                            to[1 ^ i] = 0;
                            shrinkList[1 ^ i] = true;
                            this.__scrollTo(to, onScroll, shrinkList);
                        });
                    } else if (!isShrink[i] && this.__minXY[i] > currentValue) {
                        delay(() => {
                            const to: [number, number] = [...this.__xy];
                            const shrinkList = [...isShrink];
                            to[1 ^ i] = this.__minXY[i];
                            shrinkList[1 ^ i] = true;
                            this.__scrollTo(to, onScroll, shrinkList);
                        });
                    } else {

                    }
                });
            }
        }

    }

    /**
     * 手势对应的滚动逻辑
     * 和对外的scrollTo的区别是:与时间无关的迭代衰减
     * @param distXY 目标点
     * @param onScroll 滚动回调
     * @param isShrink 是否收缩滚动, 用来防止回滚中再次执行回滚
     */
    __scrollTo(
        [distX, distY]: [number, number],
        onScroll = (([x, y]: [number, number]) => void 0),
        isShrink = [false, false],
    ) {
        // y轴变化,也会触发scrollTo, 
        // 如果x==distX, 
        // 说明x轴不动
        clearTimeout(this.id)
        let realDistX = distX;
        let realDistY = distY;
        let isOutX = false;
        let isOutY = false;

        const [__x, __y] = this.__xy;
        const [__MIN_X, __MIN_Y] = this.__minXY;
        const { tolerance } = this.__options;

        if (__x !== distX) {
            raf.cancel(__rafIdX);
            const startX = __x;
            // 容差范围内的distX
            realDistX = clamp(distX, __MIN_X - tolerance, tolerance);
            isOutX = __x >= 0 && __x <= __MIN_X;

            __nextTick(startX, realDistX, (newX, rafId) => {
                const currentX = newX;


                isAnimateScrollStopX = newX === realDistX;
                if (isAnimateScrollStopX && isAnimateScrollStopY && !isOutX && !isOutY) {
                    // __onScrollEnd()
                }

                __rafIdX = rafId;
                const _xy = this.__setXY(newX, __y);

                onScroll(_xy);

                if (!isShrink[0]) {
                    // 准备收缩
                    if (0 < currentX) {
                        delay(() => {
                            this.__scrollTo([0, __y], onScroll, [true, isShrink[1]]);
                        });
                    } else if (__MIN_X > currentX) {
                        delay(() => {
                            this.__scrollTo([__MIN_X, __y], onScroll, [true, isShrink[1]]);
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
            isOutY = __y >= 0 && __y <= __MIN_Y;

            __nextTick(startY, realDistY, (newY, rafId) => {
                const currentY = newY;

                isAnimateScrollStopY = newY === realDistY;
                if (isAnimateScrollStopX && isAnimateScrollStopY && !isOutX && !isOutY) {
                    // __onScrollEnd()
                }


                __rafIdY = rafId;
                const _xy = this.__setXY(__x, newY);

                if (!isShrink[1] && 0 < currentY) {
                    // 收缩
                    delay(() => {
                        this.__scrollTo([__x, 0], onScroll, [isShrink[0], true]);
                    });
                } else if (!isShrink[1] && __MIN_Y > currentY) {
                    delay(() => {
                        this.__scrollTo([__x, __MIN_Y], onScroll, [isShrink[0], true]);
                    });
                } else {

                }
            });
        }
    }


    /**
     * 更新尺寸
     */
    private __updateSize() {
        // 保留边框
        // 参考smooth-scroll
        const { el, contentEl } = this;
        const { offsetWidth, offsetHeight, clientWidth, clientHeight, scrollWidth, scrollHeight } = contentEl;
        this.__contentSize = [offsetWidth - clientWidth + scrollWidth, offsetHeight - clientHeight + scrollHeight];
        this.__minXY = [el.clientWidth - this.__contentSize[0], el.clientHeight - this.__contentSize[1]];
        console.log('update-size');
    }

}


function __nextTick(from: number, to: number, callback: (value: number, rafId: number) => void) {
    nextTick(to - from, (n, rafId) => {
        callback(from + n, rafId);
        // }, this.__options.damping);
    }, 0.1);
}