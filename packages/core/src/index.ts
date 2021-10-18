import AnyTouch from 'any-touch';

import raf from 'raf';
import debounce from 'lodash/debounce';

import clamp from 'lodash/clamp';
import inRange from 'lodash/inRange';

import createBar from '@any-scroll/bar';
import { setStyle, damp, tween, setTranslate, createDOMDiv, runTwice } from '@any-scroll/shared';
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
}

export const DEFAULT_OPTIONS = {
    tolerance: 100,
    damping: 0.1,
    allow: [true, true] as [boolean, boolean],
    hideBar: [false, false] as [boolean, boolean],
};

export default class extends AnyTouch {
    private __minXY: [number, number] = [0, 0];
    private __warpSize: [number, number] = [0, 0];
    private __options: Required<Options>;
    private __updateBar: any;
    readonly xy: [number, number] = [0, 0];
    contentSize: [number, number] = [0, 0];
    el: HTMLElement;
    contentEl: HTMLElement;
    // 控制scroll-end不被频繁触发
    private _scrollEndTimeId = -1;
    private _dampScrollRafId = -1;
    private _stopTimeId = -1;

    private _stopScroll = () => { };

    constructor(el: HTMLElement, options?: Options) {
        super(el);
        this.el = el;
        this.contentEl = __initDOM(el);
        this.__options = { ...DEFAULT_OPTIONS, ...options };
        this.__updateBar = createBar(el);
        // const [watch,sync,thumbEl, barEl] = createBar();
        // const pan = this.get('pan')
        // if (pan) {
        //     pan.set({ threshold: 30 });
        // }
        this.__updateSize();
        this.__updateBar(this.xy, this.__warpSize, this.__minXY, this.contentSize);
        this.__registerObserver();


        this.on(['panstart', 'panmove'], (e) => {
            const { deltaX, deltaY } = e;
            this.moveTo([this.xy[0] + deltaX, this.xy[1] + deltaY]);
        });

        this.on('panend', (e) => {
            this._scrollEndTimeId = setTimeout(() => {
                this.emit('scroll-end', this.xy);
            }, SHRINK_DELAY_TIME);
        });

        this.on('at:start', () => {
            clearTimeout(this._stopTimeId);
            // this._stopTimeId = setTimeout(() => {
            //     console.log('stop');
            this.stop();
            // }, 1000)
        });

        this.on('at:end', () => {
            this.snap();
        });

        const swipe = this.get('swipe');
        swipe && swipe.set({ velocity: 1 });
        this.on('swipe', (e) => {
            console.log('swipe');
            clearTimeout(this._scrollEndTimeId);
            let deltaX = e.speedX * 220;
            let deltaY = e.speedY * 220;
            this._dampScroll([this.xy[0] + deltaX, this.xy[1] + deltaY]);
        });

        const { allow } = this.__options;
        // 滚动鼠标X轴滑动
        const wheelX = allow[0] && !allow[1];

        watchWheel(el, ({ type, deltaY, vx, vy, target }) => {

            if ('start' === type) {

                // console.log('wheel-start');
                this.stop();
                if (wheelX) {
                    this._dampScroll([this.xy[0] - deltaY, this.xy[1]]);
                } else {
                    this._dampScroll([this.xy[0], this.xy[1] - deltaY]);
                }
            } else if ('move' === type) {
                if (wheelX) {
                    this._dampScroll([this.xy[0] - deltaY, this.xy[1]]);
                } else {
                    this._dampScroll([this.xy[0], this.xy[1] - deltaY]);
                }
            } else if ('end' === type) {
                // console.warn('wheel-end')
                if (wheelX) {
                    this._dampScroll([this.xy[0] - vy * 5, this.xy[1]]);
                } else {
                    this._dampScroll([this.xy[0], this.xy[1] - Math.ceil(vy) * 30]);
                }


            }
        });
    }

    update() {
        console.warn('update');
        this.__updateSize();
        this.__updateBar(this.xy, this.__warpSize, this.__minXY, this.contentSize);
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
        raf.cancel(this._dampScrollRafId);
        this._stopScroll();
    }

    /**
     * 吸附到最近的边缘
     */
    snap() {
        // console.log('snap');
        this._dampScroll([clamp(this.xy[0], this.__minXY[0], 0), clamp(this.xy[1], this.__minXY[1], 0)]);
    }

    /**
     * 设置位置
     * @param x
     * @param y
     * @returns
     */
    moveTo(distXY: [number, number]): [number, number] {
        clearTimeout(this._scrollEndTimeId);
        const { allow } = this.__options;

        runTwice((i) => {
            if (allow[i]) {
                this.xy[i] = clamp(distXY[i], this.__minXY[i] - this.__options.tolerance, this.__options.tolerance);
            }
        });

        if (allow.includes(true)) {
            // 钩子
            this.emit('scroll', this.xy);
            const { clientWidth, clientHeight } = this.el;
            this.__updateBar(this.xy, [clientWidth, clientHeight], this.__minXY, this.contentSize);
            setTranslate(this.contentEl, ...this.xy);
        }
        return this.xy;
    }

    scrollTo(distXY: [number, number], duration = 1000) {
        const [run, stop, done] = tween(this.xy, distXY, duration);
        run(this.moveTo.bind(this));
        this._stopScroll = stop;
        done(() => {
            this.snap();
            // console.log('done');
        });
    }

    /**
     * 手势对应的滚动逻辑
     * 和对外的scrollTo的区别是:与时间无关的迭代衰减
     * @param distXY 目标点
     * @param onScroll 滚动回调
     */
    _dampScroll(distXY: [number, number]) {
        if (distXY[0] === this.xy[0] && distXY[1] === this.xy[1]) return;

        raf.cancel(this._dampScrollRafId);
        // console.log('_dampScroll', distXY, this.xy);
        // 参数
        const { tolerance, allow } = this.__options;

        // 内部状态
        const _distXY = [...distXY] as [number, number];
        // AnyScroll实例
        type AnyScrollInstance = typeof this;

        //
        function _moveTo(context: AnyScrollInstance) {
            const { xy, __minXY } = context;

            // 获取当前值
            const _nextXY = runTwice((i) => {
                // 根据当前位置和目标计算阶"段性的目标位置"
                const _nextvalue = damp(context.xy[i], _distXY[i]);

                // 当前位置和目标都超过了界限
                if (xy[i] >= tolerance && _distXY[i] >= tolerance) {
                    // console.log(1);
                    // 复位
                    _distXY[i] = 0;
                }

                // 当前已经到达目标, 且位置超出的边框
                else if (_nextvalue == _distXY[i] && _nextvalue > 0) {
                    // console.log(2);
                    _distXY[i] = 0;
                } else if (xy[i] < __minXY[i] && _distXY[i] < __minXY[i]) {
                    // console.log(3, __minXY[i]);
                    _distXY[i] = __minXY[i];
                } else if (_nextvalue == _distXY[i] && _nextvalue < __minXY[i]) {
                    // console.log(4);
                    _distXY[i] = __minXY[i];
                } else {
                    // console.log(5);

                    return _nextvalue;
                }
                return damp(context.xy[i], _distXY[i]);
            }) as [number, number];

            context.moveTo(_nextXY);
            // console.log(allow,`_nextXY`, _nextXY, 'distXY', _distXY,);

            // 是否开启的轴已经滚动到终点
            const _needScroll = runTwice(i => allow[i] && _distXY[i] !== _nextXY[i]).some(bool => bool)

            // 迭代 OR 跳出迭代
            if (_needScroll) {
                // console.log(_distXY, _nextXY);
                context._dampScrollRafId = raf(() => {
                    _moveTo(context);
                });
            } else {
                // console.log(_distXY, _nextXY);
                // _scrollTo(context);
                context.emit('scroll-end');
            }
        }
        _moveTo(this);
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
