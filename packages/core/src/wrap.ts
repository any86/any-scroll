import AnyTouch from '@any-touch/core';
import pan from '@any-touch/pan';
import swipe from '@any-touch/swipe';

import AnyEvent from 'any-event';
// declare const WebKitMutationObserver: MutationObserver;
// declare const MozMutationObserver: MutationObserver;
// import ResizeObserver from 'resize-observer-polyfill';
import Content from './content';
import { SCROLL_END_DELAY, TYPE_BEFORE_DESTROY, TYPE_BEFORE_UPDATED, TYPE_SCROLL, TYPE_SCROLL_END, TYPE_UPDATED } from './const';
import { setStyle, render, XY } from '@any-scroll/shared';
// 防止ResizeObserver不存在报错
const { setTimeout, ResizeObserver } = window;
export interface Options {
    // 允许超过边界的最大距离
    overflowDistance?: number;
    // 减速系数
    damping?: number;
    // 允许X&Y轴线滑动
    allow?: [boolean, boolean];
    // 位移渲染函数
    render?: (el: HTMLElement, [x, y]: readonly [number, number]) => void;
}

export const DEFAULT_OPTIONS = {
    overflowDistance: 100,
    damping: 0.1,
    allow: [true, true] as [boolean, boolean],
    render,
};

type ContentRefList = InstanceType<typeof Content>[];
export default class Wrap extends AnyEvent {
    /**
     * wrap元素
     */
    el: HTMLElement;

    /**
     * 手势实例
     * 基于AnyTouch语法
     */
    at: AnyTouch;

    /**
     * wrap的尺寸
     */
    size: [number, number] = [0, 0];

    /**
     * 当前content的尺寸
     */
    // contentSize: [number, number] = [0, 0];

    /**
     * 当前触碰的元素
     */
    targets: (EventTarget | null)[] = [];

    /**
     * 选项
     */
    options: Required<Options>;

    /**
     * 当前content实例
     */
    private __currentContentRef: InstanceType<typeof Content> | null;


    // 存储content实例和元素
    private __contentRefList: ContentRefList = [];

    /**
     *
     * @param el wrap目标元素
     * @param options 选项
     */
    constructor(el: HTMLElement, options?: Options) {
        super();
        this.el = el;
        this.options = { ...DEFAULT_OPTIONS, ...options };

        setStyle(el, {
            position: `relative`,
            overflow: 'hidden',
        });

        // ⭐遍历生成Content实例
        Array.from(el.children).forEach((contentEl) => {
            // 跳过no-scroll元素
            if (contentEl.hasAttribute('no-scroll')) return;
            const contentRef = new Content(contentEl as HTMLElement, this);

            contentRef.on(TYPE_SCROLL, (arg) => {
                this.emit(TYPE_SCROLL, arg);
            });

            contentRef.on(TYPE_SCROLL_END, (arg) => {
                this.emit(TYPE_SCROLL_END, arg);
            });

            contentRef.on(TYPE_UPDATED, arg => {
                this.emit(TYPE_UPDATED, arg);
            });

            // 销毁content实例
            this.on(TYPE_BEFORE_DESTROY, () => {
                contentRef.destroy();
            });

            this.__contentRefList.push(contentRef);
        });

        // 默认contentRef为第一个contentRef
        this.__currentContentRef = this.getContentRef();

        // 监视尺寸变化
        if (ResizeObserver) {
            const ro = new ResizeObserver(this.update.bind(this));
            ro.observe(el);
            this.on(TYPE_BEFORE_DESTROY, () => {
                ro.disconnect();
            });
        } else {
            this.update();
        }

        // ========== 手势 ==========
        const at = new AnyTouch(el); 
        at.use(pan);
        at.use(swipe);

        this.at = at;

        at.on(['panstart', 'panmove'], (e) => {
            const { __currentContentRef: currentContentRef } = this;
            if (null !== currentContentRef) {
                this.targets = e.targets;
                const { deltaX, deltaY } = e;
                const { xy } = currentContentRef;
                currentContentRef.moveTo([xy[0] - deltaX, xy[1] - deltaY]);
            }
        });

        at.on('panend', (e) => {
            if (null === this.__currentContentRef) return;
            this.__currentContentRef.__scrollEndTimeId = setTimeout(() => {
                if (null !== this.__currentContentRef) {
                    this.targets = e.targets;
                    this.emit(TYPE_SCROLL_END, this.__currentContentRef.xy);
                }
            }, SCROLL_END_DELAY);
        });

        at.on('at:start', (e) => {
            this.emit('at:start');
            const targetEl = e.target as HTMLElement;
            this.__currentContentRef = this.getContentRef(targetEl);
            this.__currentContentRef?.stop();
        });

        at.on('at:end', () => {
            this.emit('at:end');
            this.__currentContentRef?.snap();
        });

        const swipeContext = at.get('swipe');
        if (swipeContext) {
            swipeContext.velocity = 1;
        }
        at.on('swipe', (e) => {
            const { __currentContentRef: currentContentRef } = this;
            if (null === currentContentRef) return;
            this.targets = e.targets;
            // clearTimeout(this._scrollEndTimeId);
            const deltaX = e.speedX * 200;
            const deltaY = e.speedY * 200;
            currentContentRef.dampScroll([currentContentRef.xy[0] - deltaX, currentContentRef.xy[1] - deltaY]);
        });

        // 把any-touch的事件冒泡到any-scroll
        at.on('at:after', e => {
            this.emit(e.name, e);
        })
    }

    /**
     * 更新"可滑动范围"
     */
    update() {
        const { clientWidth, clientHeight } = this.el;
        this.size = [clientWidth, clientHeight];
        this.emit(TYPE_BEFORE_UPDATED, this.size);
    }

    /**
     * 获取content实例,
     * 参数如果是元素,
     * 元素可以是content的子元素
     * @param elOrIndex 元素或者索引
     * @returns
     */
    getContentRef(elOrIndex?: HTMLElement | number) {
        const { __contentRefList } = this;
        // 不传参数, 返回默认ref
        if (void 0 === elOrIndex) {
            return this.__currentContentRef || __contentRefList[__contentRefList.length - 1];
        }
        // 传入数字
        else if ('number' === typeof elOrIndex) {
            return __contentRefList[Number(elOrIndex)] || null;
        }
        // 传入元素
        else {
            for (let ref of __contentRefList) {
                // 目标元素是否content元素的子元素
                if (ref.el.contains(elOrIndex)) {
                    return ref;
                }
            }
            return this.__currentContentRef;
        }
    }

    /**
     * 指定content为激活状态
     * @param contentRef 
     */
    active(contentRef: Content) {
        this.__currentContentRef = contentRef;
    }

    /**
     * 瞬移到目标位置
     * @param distXY 目标位置
     * @returns 目标位置
     */
    moveTo(distXY: readonly [number, number]) {
        return this.__currentContentRef?.moveTo(distXY);
    }

    /**
     * 滚动到目标位置, 支持动画
     * @param distXY 目标位置
     * @param duration 动画时长
     * @param easing 缓动函数
     */
    scrollTo(distXY: [number, number], duration = 1000, easing?: (t: number) => number) {
        this.__currentContentRef?.scrollTo(distXY, duration, easing);
    }

    /**
     * 滚动到目标元素, 
     * 元素左上角尽量与wrap左上角重合
     * @param el 目标元素
     * @param offset 对目标位置的修正
     * @param duration 动画时长
     * @param easingFunction 缓动函数
     */
    scrollToElement(el: HTMLElement, offset?: XY, duration?: number, easing?: (t: number) => number) {
        this.__currentContentRef?.scrollToElement(el, offset, duration, easing);
    }

    /**
     * 衰减滚动
     * 作用同scrollTo,
     * 只是滚动效果不同, 
     * 其不能指定时间. 
     * 模拟快速划动scrollView产生的滚动.
     * @param distXY 目标坐标
     * @param damping 每次衰减比例. 
     */
    dampScroll(distXY: readonly [number, number], damping = this.options.damping) {
        this.__currentContentRef?.dampScroll(distXY, damping);
    }

    /**
     * 立即停止滑动
     */
    stop() {
        this.__currentContentRef?.stop();
    }

    /**
     * 销毁
     */
    destroy() {
        this.emit(TYPE_BEFORE_DESTROY);
        this.at.destroy();
        super.destroy();
    }
}
