import AnyEvent from 'any-event';
import raf from 'raf';
import clamp from 'lodash/clamp';
import inRange from 'lodash/inRange';
import { setStyle, damp, tween, setTranslate, runTwice } from '@any-scroll/shared';
import ResizeObserver from 'resize-observer-polyfill';

// 类型
import { Options } from './wrap';

export default class extends AnyEvent {
    /**
     * 请用moveTo修改xy;
     */
    readonly xy: [number, number] = [0, 0];

    minXY: [number, number] = [0, 0];
    maxXY: [number, number] = [0, 0];
    wrapSize: [number, number] = [0, 0];
    contentSize: [number, number] = [0, 0];
    el: HTMLElement;
    wrapEl: HTMLElement;
    targets: (EventTarget | null)[] = [];
    isScrolling = false;

    private __options: Required<Options>;
    // 控制scroll-end不被频繁触发
    private _scrollEndTimeId = -1;
    private _dampScrollRafId = -1;
    private __stopScroll = () => { };

    constructor(contentEl: HTMLElement, wrapEl: HTMLElement, options: Required<Options>) {
        super();
        this.el = contentEl;
        this.wrapEl = wrapEl;
        this.__options = options;
        setStyle(contentEl, { position: 'absolute' });
        this.update();
        if (this.__options.watchResize) {
            const ro = new ResizeObserver(() => {
                this.update();
                this.emit('resize');
            });
            ro.observe(contentEl);
        }
    }

    set(options: Options) {
        this.__options = { ...this.__options, ...options };
        this.update();
    }


    /**
     * 更新尺寸
     */
    update() {
        const { wrapEl, el: contentEl } = this;
        const { offsetWidth, offsetHeight, clientWidth, clientHeight, scrollWidth, scrollHeight } = contentEl;
        // scrollView尺寸
        this.wrapSize = [wrapEl.clientWidth, wrapEl.clientHeight];
        // 内容尺寸
        // 保留边框
        // 参考smooth-scroll
        // console.log(offsetHeight , clientHeight , scrollHeight);
        this.contentSize = [offsetWidth - clientWidth + scrollWidth, offsetHeight - clientHeight + scrollHeight];

        this.minXY = [
            Math.min(0, this.wrapSize[0] - this.contentSize[0]),
            Math.min(0, this.wrapSize[1] - this.contentSize[1]),
        ];

        this.maxXY = [0, 0];
        // console.warn('__warpSize', this.wrapSize, 'contentSize', this.contentSize, '__minXY', this.minXY, '__maxXY', this.maxXY);
    }

    /**
     * 立即停止滑动
     */
    stop() {
        if (this.isScrolling && this.xy.every((v, i) => inRange(v, this.minXY[i], this.maxXY[i]))) {
            this.emit('scroll-end');
        }
        this.isScrolling = false;
        raf.cancel(this._dampScrollRafId);
        this.__stopScroll();
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
            setTranslate(this.el, ...this.xy);
        }
        return this.xy;
    }

    scrollTo(distXY: [number, number], duration = 1000) {
        this.stop();
        this.isScrolling = true;
        const [run, stop, done] = tween(this.xy, distXY, duration);
        run(this.moveTo.bind(this));
        this.__stopScroll = stop;
        done(() => {
            this.snap();
            this.isScrolling = false;
        });
    }

    /**
     * swipe手势对应的滚动逻辑
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
            context.isScrolling = true;
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
                context.isScrolling = false;
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