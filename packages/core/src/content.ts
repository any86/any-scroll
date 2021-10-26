import AnyEvent from 'any-event';
import raf from 'raf';
import clamp from 'lodash/clamp';
import { setStyle, damp, tween, setTranslate, runTwice } from '@any-scroll/shared';
type XY = [number, number];
declare const WebKitMutationObserver: MutationObserver;
declare const MozMutationObserver: MutationObserver;
export interface Options {
    // 允许超过边界的最大距离
    overflowDistance?: number;
    // 减速系数
    damping?: number;
    // 允许X&Y轴线滑动
    allow?: [boolean, boolean];

    hideBar?: [boolean, boolean];
    // 超出界限后自动吸附边框
    snap?: boolean;
}

export const DEFAULT_OPTIONS = {
    overflowDistance: 100,
    damping: 0.1,
    allow: [true, true] as [boolean, boolean],
    hideBar: [false, false] as [boolean, boolean],
    snap: true,
};

export default class extends AnyEvent {
    readonly xy: [number, number] = [0, 0];

    minXY: [number, number] = [0, 0];
    maxXY: [number, number] = [0, 0];
    wrapSize: [number, number] = [0, 0];
    contentSize: [number, number] = [0, 0];
    el: HTMLElement;
    wrapEl: HTMLElement;
    targets: (EventTarget | null)[] = [];

    private __options: Required<Options>;
    // 控制scroll-end不被频繁触发
    private _scrollEndTimeId = -1;
    private _dampScrollRafId = -1;
    private _stopScroll = () => { };

    constructor(contentEl: HTMLElement, wrapEl: HTMLElement, options: Options) {
        super();
        this.el = contentEl;
        this.wrapEl = wrapEl;
        this.__options = { ...DEFAULT_OPTIONS, ...options };
        setStyle(contentEl, { position: 'absolute' });
        this.update();
        this.__registerObserver();
    }

    set(options: Options) {
        this.__options = { ...this.__options, ...options };
        this.update();
    }

    update() {
        console.warn('update');

        this.__updateSize();
    }

    /**
     * 更新尺寸
     */
    private __updateSize() {

        const { wrapEl, el: contentEl } = this;
        const { offsetWidth, offsetHeight, clientWidth, clientHeight, scrollWidth, scrollHeight } = contentEl;
        // scrollView尺寸
        this.wrapSize = [wrapEl.clientWidth, wrapEl.clientHeight];
        // 内容尺寸
        // 保留边框
        // 参考smooth-scroll
        this.contentSize = [offsetWidth - clientWidth + scrollWidth, offsetHeight - clientHeight + scrollHeight];

        this.minXY = [
            Math.min(0, this.wrapSize[0] - this.contentSize[0]),
            Math.min(0, this.wrapSize[1] - this.contentSize[1]),
        ];

        this.maxXY = [0, 0];

        console.log('__warpSize', this.wrapSize);
        console.log('contentSize', this.contentSize);
        console.log('__minXY', this.minXY);
        console.log('__maxXY', this.maxXY);

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
            ob.observe(this.el, {
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
        if (this.__options.snap) {
            // console.log('snap');
            const xy = runTwice(i => {
                return clamp(this.xy[i], this.minXY[i], this.maxXY[i]);
            });
            this._dampScroll(xy);
        }
    }

    /**
     * 设置位置
     * @param x
     * @param y
     * @returns
     */
    moveTo(distXY: readonly [number, number]): [number, number] {
        clearTimeout(this._scrollEndTimeId);
        const { allow, overflowDistance } = this.__options;
        runTwice((i) => {
            if (allow[i]) {
                this.xy[i] = clamp(
                    distXY[i],
                    this.minXY[i] - overflowDistance,
                    this.maxXY[i] + overflowDistance
                );
            }
        });

        if (allow.includes(true)) {
            const [x, y] = this.xy;
            const { targets } = this;
            const target = targets[0];
            // 钩子
            this.emit('scroll', { targets, target, x, y });
            // const { clientWidth, clientHeight } = this.wrapEl;
            // this.__updateBar(this.xy, [clientWidth, clientHeight], this.__minXY, this.contentSize);
            setTranslate(this.el, ...this.xy);
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
    _dampScroll(distXY: readonly [number, number]) {
        if (distXY[0] === this.xy[0] && distXY[1] === this.xy[1]) return;

        raf.cancel(this._dampScrollRafId);
        // console.log('_dampScroll', distXY, this.xy);
        // 参数
        const { overflowDistance, allow } = this.__options;

        // 内部状态, 根据不同位置会发生变化
        const _distXY = [...distXY] as [number, number];

        // AnyScroll实例
        type AnyScrollInstance = typeof this;
        function _moveTo(context: AnyScrollInstance) {
            const { xy, minXY: __minXY, maxXY: __maxXY } = context;

            // 获取当前值
            const _nextXY = runTwice((i) => {
                // 根据当前位置和目标计算阶"段性的目标位置"(修正distXY)
                const _nextvalue = damp(context.xy[i], _distXY[i]);
                // console.log(i, { _nextvalue }, context.xy[i], _distXY[i]);
                // 当前位置和目标都超过了界限
                if (xy[i] >= __maxXY[i] + overflowDistance) {
                    // 复位
                    _distXY[i] = __maxXY[i];
                } else if (xy[i] <= __minXY[i] - overflowDistance) {
                    _distXY[i] = __minXY[i];
                } else {
                    // 当前已经到达目标, 且位置超出的边框
                    if (xy[i] === _distXY[i] && _nextvalue === _distXY[i]) {
                        if (xy[i] > __maxXY[i]) {
                            _distXY[i] = __maxXY[i];
                        } else if (xy[i] < __minXY[i]) {
                            _distXY[i] = __minXY[i];
                        }
                    } else {
                        return _nextvalue;
                    }
                }
                return damp(context.xy[i], _distXY[i]);
            });

            context.moveTo(_nextXY);

            // 是否开启的轴已经滚动到终点
            const _needScroll = runTwice((i) => allow[i] && _distXY[i] !== _nextXY[i]).some((bool) => bool);

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
     * 销毁
     */
    destroy() {
        super.destroy();
    }
}