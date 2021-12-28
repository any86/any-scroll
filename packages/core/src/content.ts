import AnyEvent from 'any-event';
import raf from 'raf';
import clamp from 'lodash/clamp';
import inRange from 'lodash/inRange';
import { setStyle, damp, tween, runTwice } from '@any-scroll/shared';
import { xY2Tuple, easing } from '@any-scroll/shared';
import { TYPE_BEFORE_DESTROY, TYPE_BEFORE_UPDATED, TYPE_SCROLL_END, TYPE_UPDATED } from './const';
// 类型
import type { Options } from './wrap';
import type { XY } from '@any-scroll/shared';
import Wrap from './wrap';

interface ContentOptions extends Required<Options> {
    minXY?: (context: Content) => [number, number];
    maxXY?: (context: Content) => [number, number];
}

// 防止ResizeObserver/MutationObserver不存在报错
const { ResizeObserver, MutationObserver } = window;

export default class Content extends AnyEvent {
    /**
     * 请用{@link moveTo}修改xy;
     */
    readonly xy: [number, number] = [0, 0];

    /**
     * warp左上角和content左上角的最小距离
     */
    minXY: [number, number] = [0, 0];
    /**
     * warp左上角和content左上角的最大距离
     */
    maxXY: [number, number] = [0, 0];
    wrapSize: [number, number] = [0, 0];
    contentSize: [number, number] = [0, 0];
    el: HTMLElement;
    wrapRef: Wrap;
    targets: (EventTarget | null)[] = [];
    isScrolling = false;

    private __options: ContentOptions;
    // 控制scroll-end不被频繁触发
    __scrollEndTimeId = -1;
    private __dampScrollRafId = -1;
    private __stopScroll = () => { };

    /**
     * 初始化content
     * @param contentEl 内容元素
     * @param wrapRef wrap实例
     */
    constructor(contentEl: HTMLElement, wrapRef: Wrap) {
        super();
        this.el = contentEl;
        this.wrapRef = wrapRef;
        const { options } = wrapRef;
        this.__options = options;
        // setStyle(contentEl, { position: 'absolute' });
        // this.__options.render(this.el, this.xy);
        wrapRef.on(TYPE_BEFORE_UPDATED, () => {
            this.update();
        });

        // this.on('scroll', () => {
        //     clearTimeout(this.__scrollEndTimeId);
        // });

        // 监视content元素尺寸变化
        if (ResizeObserver) {
            const ro = new ResizeObserver(() => {
                this.update();
            });
            ro.observe(contentEl);
            this.on(TYPE_BEFORE_DESTROY, () => {
                ro.disconnect();
            })
        }
        // 降级用MutationObserver兼容
        else if (MutationObserver) {
            this.update();
            const observer = new MutationObserver(() => {
                this.update();
            });

            observer.observe(contentEl, {
                childList: true, // 观察目标子节点的变化，是否有添加或者删除
                // attributes: true, // 观察属性变动, content上transform的变化会频繁触发
                subtree: true, // 观察后代节点，默认为 false
            });

            this.on(TYPE_BEFORE_DESTROY, () => {
                observer.disconnect();
            })
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
        const { el } = this;
        const { offsetWidth, offsetHeight, clientWidth, clientHeight, scrollWidth, scrollHeight } = el;
        // scrollView尺寸
        this.wrapSize = [this.wrapRef.size[0], this.wrapRef.size[1]];

        // 内容尺寸
        // 保留边框
        // 参考smooth-scroll
        this.contentSize = [offsetWidth - clientWidth + scrollWidth, offsetHeight - clientHeight + scrollHeight];

        // warp左上角和content左上角的距离
        this.maxXY = this.__options.maxXY
            ? this.__options.maxXY(this)
            : [
                Math.max(0, this.contentSize[0] - this.wrapSize[0]),
                Math.max(0, this.contentSize[1] - this.wrapSize[1]),
            ];

        this.minXY = this.__options.minXY ? this.__options.minXY(this) : [0, 0];
        this.emit(TYPE_UPDATED, this);
        // console.log(this.minXY, this.maxXY);
    }

    /**
     * 立即停止滑动
     */
    stop() {
        if (this.isScrolling && this.xy.every((v, i) => inRange(v, this.minXY[i], this.maxXY[i]))) {
            this.emit(TYPE_SCROLL_END, this.xy);
        }
        this.isScrolling = false;
        raf.cancel(this.__dampScrollRafId);
        this.__stopScroll();
    }

    /**
     * 吸附到最近的边缘
     */
    snap() {
        // console.log('snap');
        const xy = runTwice((i) => clamp(this.xy[i], this.minXY[i], this.maxXY[i]));
        this.dampScroll(xy);
    }

    /**
     * 瞬移到目标位置
     * @param distXY 目标位置
     * @returns 目标位置
     */
    moveTo(distXY: XY): [number, number] {
        const { allow, overflowDistance } = this.__options;
        if (!allow.includes(true)) return this.xy;

        clearTimeout(this.__scrollEndTimeId);
        const tupleXY = xY2Tuple(distXY, this.xy);
        const nextXY = runTwice((i) => {
            if (allow[i] && void 0 !== tupleXY[i]) {
                return clamp(tupleXY[i], this.minXY[i] - overflowDistance, this.maxXY[i] + overflowDistance);
            }
            return this.xy[i];
        });

        // 计算是否需要移动
        const isChanged = this.xy.some((xOrY, i) => xOrY !== nextXY[i]);
        if (!isChanged) return this.xy;

        // 移动到目标
        runTwice((i) => (this.xy[i] = nextXY[i]));

        const [x, y] = this.xy;
        const { targets } = this;
        const target = targets[0];
        // 钩子
        this.emit('scroll', { targets, target, x, y });
        this.__options.render(this.el, [-this.xy[0], -this.xy[1]]);
        return this.xy;
    }

    /**
     * 滚动到目标位置, 支持动画
     * @param distXY 目标位置
     * @param duration 动画时长
     * @param easing 缓动函数
     */
    scrollTo(distXY: XY, duration = 1000, easing?: (t: number) => number) {
        const tupleXY = xY2Tuple(distXY, this.xy);
        const { overflowDistance } = this.__options;
        this.stop();
        this.isScrolling = true;
        const realDist = runTwice((i) =>
            clamp(tupleXY[i], this.minXY[i] - overflowDistance, this.maxXY[i] + overflowDistance)
        );
        const [run, stop, done] = tween(this.xy, realDist, duration, easing);
        run(this.moveTo.bind(this));
        this.__stopScroll = stop;
        done(() => {
            this.snap();
            this.isScrolling = false;
        });
    }

    /**
     * 滚动到目标元素, 
     * 元素左上角尽量与wrap左上角重合
     * @param el 目标元素
     * @param offset 对目标位置的修正
     * @param duration 动画时长
     * @param easingFunction 缓动函数
     */
    scrollToElement(el: HTMLElement, offset: XY = [0, 0], duration = 1000, easingFunction = easing) {
        // 确保是激活content的子元素
        if (!this.el.contains(el)) return;
        const offsetTuple = xY2Tuple(offset, [0, 0]);
        const rect = this.wrapRef.el.getBoundingClientRect();
        const { x, y } = el.getBoundingClientRect();
        const distXY = runTwice(i => this.xy[i] + [x, y][i] - [rect.x, rect.y][i] + offsetTuple[i]);
        this.scrollTo(distXY, duration, easingFunction)
    }

    /**
     * swipe手势对应的滚动逻辑
     * 和对外的scrollTo的区别是:与时间无关的迭代衰减
     * @param tupleXY 目标点
     * @param onScroll 滚动回调
     */
    dampScroll(distXY: XY, damping?: number) {
        const tupleXY = xY2Tuple(distXY, this.xy);
        // 参数
        const { overflowDistance, allow } = this.__options;
        const noScroll = runTwice((i) => !allow[i] || tupleXY[i] === this.xy[i]).every((isMoved) => isMoved);
        if (noScroll) return;

        raf.cancel(this.__dampScrollRafId);
        // console.log('_dampScroll', distXY, this.xy);

        // 内部状态, 根据不同位置会发生变化
        const _distXY: [number, number] = [...tupleXY];

        // raf刷新的移动,
        function _moveTo(context: Content) {
            // 是否到达终点
            context.isScrolling = true;
            const { xy, minXY, maxXY } = context;

            // 计算有效的当前值
            const _nextXY = runTwice((i) => {
                if (!allow[i]) return xy[i];

                // 预判接下来的位置
                const _nextValue = damp(context.xy[i], _distXY[i], damping);
                // console.log(i, xy[i], _nextvalue, _distXY[i], distXY[i]);

                // ====== 根据当前位置和目标计算"阶段性的目标位置"(修正distXY) ======

                // 超过了最大界限,需要重新计算_nextValue
                if (_nextValue >= maxXY[i] + overflowDistance) {
                    // 复位到最近的边
                    _distXY[i] = maxXY[i];
                }
                // 超过最小
                else if (_nextValue <= minXY[i] - overflowDistance) {
                    _distXY[i] = minXY[i];
                }
                // 可移动范围内
                else {
                    // 当前已经到达目标
                    if (_nextValue === _distXY[i]) {
                        // 但是位置超出的边框
                        // 重新计算_distXY
                        if (xy[i] > maxXY[i]) {
                            _distXY[i] = maxXY[i];
                        } else if (xy[i] < minXY[i]) {
                            _distXY[i] = minXY[i];
                        }
                    } else {
                        return _nextValue;
                    }
                }
                return damp(context.xy[i], _distXY[i], damping);
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
