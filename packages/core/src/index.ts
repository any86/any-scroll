import AnyTouch from 'any-touch'

import raf from 'raf';
import debounce from 'lodash/debounce';

import clamp from 'lodash/clamp';
import createBar from '@any-scroll/bar';
import { setStyle, easeOutCubic, setTranslate, delay, nextTick, createDOMDiv } from '@any-scroll/shared';
import watchWheel from './wheel';
import { STYLE, CONTENT_STYLE, SHRINK_DELAY_TIME, CLASS_NAME_ANY_SCROLL } from './const';
const { setTimeout } = window;

declare const WebKitMutationObserver: MutationObserver;
declare const MozMutationObserver: MutationObserver;


export interface Options {
    // 允许超过边界的最大距离
    tolerance?: number;
    // 减速系数
    damping?: number;
    // 允许X&Y轴线滑动
    allow?: [boolean, boolean];

    hideBar?: [boolean, boolean];
};

export const DEFAULT_OPTIONS = {
    tolerance: 100,
    damping: 0.1,
    allow: [true, true] as [boolean, boolean],
    hideBar: [false, false] as [boolean, boolean]
};

export default class extends AnyTouch {
    private __xy: [number, number] = [0, 0];
    private __rafIdXY: [number, number] = [-1, -1];
    // 给按时间和距离滚动的函数使用
    private __rafId = -1;
    private __minXY: [number, number] = [0, 0];
    private contentSize: [number, number] = [0, 0];
    private __warpSize: [number, number] = [0, 0];
    private __isAnimateScrollStop: [boolean, boolean] = [true, true];
    private __options: Required<Options>;
    __updateBar: any;
    el: HTMLElement;
    contentEl: HTMLElement;
    scrollEndTimeId = -1;

    constructor(el: HTMLElement, options?: Options) {
        super(el);
        this.el = el;
        this.contentEl = __initDOM(el);
        this.__options = { ...DEFAULT_OPTIONS, ...options, };
        this.__updateBar = createBar(el);
        // const [watch,sync,thumbEl, barEl] = createBar();

        this.__updateSize();
        this.__updateBar(this.__xy, this.__warpSize, this.__minXY, this.contentSize);
        this.__registerObserver();

        this.on('panmove', e => {
            const { deltaX, deltaY } = e;
            this.setXY(this.__xy[0] + deltaX, this.__xy[1] + deltaY);
        });

        this.on('panend', e => {
            this.snap();

            this.scrollEndTimeId = setTimeout(() => {
                this.emit('scroll-end', this.__xy);
            }, SHRINK_DELAY_TIME)
        })


        this.on('at:start', e => {
            this.stop();
        });

        const swipe = this.get('swipe');
        swipe && swipe.set({ velocity: 1 });
        this.on('swipe', e => {
            clearTimeout(this.scrollEndTimeId)
            let deltaX = e.speedX * 100;
            let deltaY = e.speedY * 100;
            this.scrollTo([this.__xy[0] + deltaX, this.__xy[1] + deltaY]);
        });


        const { allow } = this.__options;
        // 滚动鼠标X轴滑动
        const wheelX = allow[0] && !allow[1];
        watchWheel(el, ({ type, deltaY, v, target }) => {
            if ('start' === type) {
                this.stop();
            } else if ('move' === type) {
                if (wheelX) {
                    this.setXY(this.__xy[0] + deltaY, this.__xy[1]);
                } else {
                    this.setXY(this.__xy[0], this.__xy[1] + deltaY);
                }
            } else if ('end' === type) {
                if (5 < Math.abs(v)) {
                    if (wheelX) {
                        this.scrollTo([this.__xy[0] + v * 200, this.__xy[1]])
                    } else {
                        this.scrollTo([this.__xy[0], this.__xy[1] + v * 200])
                    }
                } else {
                    this.snap()
                }
            }
        });

    }

    update() {
        this.__updateSize();
        this.__updateBar(this.__xy, this.__warpSize, this.__minXY, this.contentSize);
    }
    /**
     * 注册监听
     */
    __registerObserver() {
        window.addEventListener('resize', this.update.bind(this));
        const Observer = MutationObserver || WebKitMutationObserver || MozMutationObserver;
        // observe
        if (typeof Observer === 'function') {
            const ob = new Observer(this.update.bind(this));
            ob.observe(this.contentEl, {
                subtree: true,
                childList: true,
            });
        }
    }
    /**
     * 立即停止滑动
     */
    stop() {
        raf.cancel(this.__rafId);
        raf.cancel(this.__rafIdXY[0]);
        raf.cancel(this.__rafIdXY[1]);
    }

    /**
     * 吸附到最近的边缘
     */
    snap() {
        this.scrollTo([clamp(this.__xy[0], this.__minXY[0], 0), clamp(this.__xy[1], this.__minXY[1], 0)]);
    }

    /**
     * 设置位置
     * @param x 
     * @param y 
     * @returns 
     */
    private setXY(x: number, y: number): [number, number] {
        const { allow } = this.__options;

        if (allow[0]) {
            // 同步
            this.__xy[0] = clamp(x, this.__minXY[0] - this.__options.tolerance, this.__options.tolerance);
        }

        if (allow[1]) {
            this.__xy[1] = clamp(y, this.__minXY[1] - this.__options.tolerance, this.__options.tolerance);
        }

        if (allow.includes(true)) {
            // 钩子
            this.emit('scroll', this.__xy);
            const { clientWidth, clientHeight } = this.el;
            this.__updateBar(this.__xy, [clientWidth, clientHeight], this.__minXY, this.contentSize);
            setTranslate(this.contentEl, ...this.__xy);
        }
        return this.__xy;

    }

    /**
     * 手势对应的滚动逻辑
     * 和对外的scrollTo的区别是:与时间无关的迭代衰减
     * @param distXY 目标点
     * @param onScroll 滚动回调
     * @param isShrink 是否收缩滚动, 用来防止回滚中再次执行回滚
     */
    scrollTo(
        dist: [number, number],
        onScroll = (([x, y]: [number, number]) => void 0),
        isShrink = [false, false],
    ) {
        // y轴变化,也会触发scrollTo, 
        // 如果x==distX, 
        // 说明x轴不动
        clearTimeout(this.scrollEndTimeId)
        let _realDist = [...dist];
        let _isOutXY = [false, false];
        const { __minXY, __xy } = this;
        const { tolerance } = this.__options;
        for (let i = 0; i < 2; i++) {
            if (__xy[i] !== dist[i]) {
                raf.cancel(this.__rafIdXY[i]);
                // 容差范围内的dist[i]
                _realDist[i] = clamp(dist[i], __minXY[i] - tolerance, tolerance);
                _isOutXY[i] = __xy[i] >= 0 && __xy[i] <= __minXY[i];
                __nextTick(__xy[i], _realDist[i], (newValue, rafId) => {
                    this.__isAnimateScrollStop[i] = newValue === _realDist[i];
                    // if (this.__isAnimateScrollStop.every(is => is) && _isOutXY.every(is => !is)) {
                    if (this.__isAnimateScrollStop.every(is => is)) {
                        this.emit('scroll-end', this.__xy);
                    }

                    this.__rafIdXY[i] = rafId;
                    const newXY: [number, number] = [...this.__xy];
                    newXY[i] = newValue;
                    this.setXY(...newXY);
                    onScroll(this.__xy);

                    if (!isShrink[i]) {
                        // 准备收缩
                        const isShrinks = [...isShrink];
                        isShrinks[i] = true;

                        if (0 < newValue) {
                            delay(() => {
                                const toXY: [number, number] = [...this.__xy];
                                toXY[i] = 0;
                                this.scrollTo(toXY, onScroll, isShrinks);
                            });
                        } else if (__minXY[i] > newValue) {
                            delay(() => {
                                const toXY: [number, number] = [...this.__xy];
                                toXY[i] = __minXY[i];
                                this.scrollTo(toXY, onScroll, isShrinks);
                            });
                        }
                    }
                });
            }
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
        this.__warpSize = [el.clientWidth, el.clientHeight];
        this.contentSize = [offsetWidth - clientWidth + scrollWidth, offsetHeight - clientHeight + scrollHeight];
        this.__minXY = [el.clientWidth - this.contentSize[0], el.clientHeight - this.contentSize[1]];
    }

    /**
     * 销毁
     */
    destroy() {
        super.destroy();
    }
}

function __nextTick(from: number, to: number, callback: (value: number, rafId: number) => void) {
    nextTick(to - from, (n, rafId) => {
        callback(from + n, rafId);
    }, 0.1);
}

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
    const contentEl = createDOMDiv();
    while (el.firstChild) {
        contentEl.appendChild(el.firstChild);
    }
    // 设置内容器样式
    setStyle(contentEl, CONTENT_STYLE);
    el.appendChild(contentEl);
    return contentEl;
}