import AnyEvent from 'any-event';
import raf from 'raf';
import clamp from 'lodash/clamp';
import inRange from 'lodash/inRange';
import { setStyle, damp, tween, runTwice, easing } from '@any-scroll/shared';
import ResizeObserver from 'resize-observer-polyfill';
// 类型
import { Options } from './wrap';

interface ContentOptions extends Required<Options> {
    minXY?: (context: Content) => [number, number];
    maxXY?: (context: Content) => [number, number];
}
export default class Content extends AnyEvent {
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

    private __options: ContentOptions;
    // 控制scroll-end不被频繁触发
    __scrollEndTimeId = -1;
    private __dampScrollRafId = -1;
    private __stopScroll = () => { };

    constructor(contentEl: HTMLElement, wrapEl: HTMLElement, options: ContentOptions) {
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

    set(options: ContentOptions) {
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

        this.minXY = this.__options.minXY
            ? this.__options.minXY(this)
            : [
                Math.min(0, this.wrapSize[0] - this.contentSize[0]),
                Math.min(0, this.wrapSize[1] - this.contentSize[1]),
            ];

        this.maxXY = this.__options.maxXY ? this.__options.maxXY(this) : [0, 0];
        // console.warn('__warpSize', this.wrapSize, 'contentSize', this.contentSize, '__minXY', this.minXY, '__maxXY', this.maxXY);
    }

    /**
     * 立即停止滑动
     */
    stop() {
        if (this.isScrolling && this.xy.every((v, i) => inRange(v, this.minXY[i], this.maxXY[i]))) {
            this.emit('scroll-end', this.xy);
        }
        this.isScrolling = false;
        raf.cancel(this.__dampScrollRafId);
        this.__stopScroll();
    }

    /**
     * 吸附到最近的边缘
     */
    snap() {
        if (this.__options.snap) {
            // console.log('snap');
            const xy = runTwice((i) => {
                return clamp(this.xy[i], this.minXY[i], this.maxXY[i]);
            });
            this.dampScroll(xy);
        }
    }

    /**
     * 设置位置
     * @param x
     * @param y
     * @returns
     */
    moveTo(distXY: readonly [number, number]): [number, number] {
        const isChanged = this.xy.some((xOrY, i) => xOrY !== distXY[i]);
        if (!isChanged) return this.xy;
        console.log();
        clearTimeout(this.__scrollEndTimeId);
        const { allow, overflowDistance } = this.__options;
        runTwice((i) => {
            if (allow[i]) {
                this.xy[i] = clamp(distXY[i], this.minXY[i] - overflowDistance, this.maxXY[i] + overflowDistance);
            }
        });

        if (allow.includes(true)) {
            const [x, y] = this.xy;
            const { targets } = this;
            const target = targets[0];
            // 钩子
            this.emit('scroll', { targets, target, x, y });
            this.__options.render(this.el, ...this.xy);
        }
        return this.xy;
    }

    scrollTo(distXY: [number, number], duration = 1000, easing?: (t: number) => number) {
        this.stop();
        this.isScrolling = true;
        const [run, stop, done] = tween(this.xy, distXY, duration, easing);
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
    dampScroll(distXY: readonly [number, number],damping?:number) {
        // 参数
        const { overflowDistance, allow } = this.__options;
        const noScroll = runTwice((i) => !allow[i] || distXY[i] === this.xy[i]).every((is) => is);
        if (noScroll) return;

        raf.cancel(this.__dampScrollRafId);
        // console.log('_dampScroll', distXY, this.xy);

        // 内部状态, 根据不同位置会发生变化
        const _distXY = [...distXY] as [number, number];

        // 每次位移
        function _moveTo(context: Content) {
            // 是否到达终点
            context.isScrolling = true;
            const { xy, minXY, maxXY } = context;

            // 计算有效的当前值
            const _nextXY = runTwice((i) => {
                if (!allow[i]) return xy[i];

                // 预判接下来的位置
                const _nextvalue = damp(context.xy[i], _distXY[i],damping);
                // console.log(i, xy[i], _nextvalue, _distXY[i], distXY[i]);

                // ====== 根据当前位置和目标计算"阶段性的目标位置"(修正distXY) ======

                // 超过了最大界限,需要重新计算_nextValue
                if (_nextvalue >= maxXY[i] + overflowDistance) {
                    // 复位
                    _distXY[i] = maxXY[i];
                }
                // 超过最小
                else if (_nextvalue <= minXY[i] - overflowDistance) {
                    _distXY[i] = minXY[i];
                }
                // 可移动范围内
                else {
                    // 当前已经到达目标
                    if (_nextvalue === _distXY[i]) {
                        // 但是位置超出的边框
                        // 重新计算_distXY
                        if (xy[i] > maxXY[i]) {
                            _distXY[i] = maxXY[i];
                        } else if (xy[i] < minXY[i]) {
                            _distXY[i] = minXY[i];
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
                context.__dampScrollRafId = raf(() => {
                    _moveTo(context);
                });
            } else {
                context.isScrolling = false;
                context.emit('scroll-end', context.xy);
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
