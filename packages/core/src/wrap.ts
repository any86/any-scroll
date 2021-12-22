import AnyTouch from 'any-touch';
import AnyEvent from 'any-event';
// declare const WebKitMutationObserver: MutationObserver;
// declare const MozMutationObserver: MutationObserver;
// import ResizeObserver from 'resize-observer-polyfill';
import isElement from 'lodash/isElement';
import Content from './content';
import { SCROLL_END_DELAY, TYPE_BEFORE_DESTROY } from './const';
import { setStyle, render } from '@any-scroll/shared';
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

    // size: [number, number] = [0, 0];
    // contentSize: [number, number] = [0, 0];
    targets: (EventTarget | null)[] = [];

    /**
     * 选项
     */
    options: Required<Options>;

    /**
     * 当前content实例
     */
    currentContentRef: InstanceType<typeof Content> | null;

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

        // 遍历content元素
        // ⭐生成Content实例
        Array.from(el.children).forEach((contentEl) => {
            const contentRef = new Content(contentEl as HTMLElement, this);
            contentRef.on('resize', () => {
                this.update();
                this.emit('resize');
            });

            contentRef.on('scroll', (arg) => {
                this.emit('scroll', arg);
            });

            contentRef.on('scroll-end', (arg) => {
                this.emit('scroll-end', arg);
            });

            // 销毁content实例
            this.on(TYPE_BEFORE_DESTROY, () => {
                contentRef.destroy();
            });

            this.__contentRefList.push(contentRef);
        });

        // 默认contentRef为第一个contentRef
        this.currentContentRef = this.getContentRef();

        // 监视尺寸变化
        if (ResizeObserver) {
            const ro = new ResizeObserver(this.update.bind(this));
            ro.observe(el);
            this.on(TYPE_BEFORE_DESTROY, () => {
                ro.disconnect();
            });
        }

        // ========== 手势 ==========
        const at = new AnyTouch(el);
        this.at = at;

        at.on(['panstart', 'panmove'], (e) => {
            const { currentContentRef } = this;
            if (null !== currentContentRef) {
                this.targets = e.targets;
                const { deltaX, deltaY } = e;
                const { xy } = currentContentRef;
                currentContentRef.moveTo([xy[0] + deltaX, xy[1] + deltaY]);
            }
        });

        at.on('panend', (e) => {
            if (null === this.currentContentRef) return;
            this.currentContentRef.__scrollEndTimeId = setTimeout(() => {
                if (null !== this.currentContentRef) {
                    this.targets = e.targets;
                    this.emit('scroll-end', this.currentContentRef.xy);
                }
            }, SCROLL_END_DELAY);
        });

        at.on('at:start', (e) => {
            this.emit('at:start');
            const targetEl = e.target as HTMLElement;
            this.currentContentRef = this.findContentRef(targetEl);
            this.currentContentRef?.stop();
        });

        at.on('at:end', () => {
            this.emit('at:end');
            this.currentContentRef?.snap();
        });

        const swipe = at.get('swipe');
        if (swipe) {
            swipe.velocity = 1;
        }
        at.on('swipe', (e) => {
            const { currentContentRef } = this;
            if (null === currentContentRef) return;
            this.targets = e.targets;
            // clearTimeout(this._scrollEndTimeId);
            const deltaX = e.speedX * 200;
            const deltaY = e.speedY * 200;
            currentContentRef.dampScroll([currentContentRef.xy[0] + deltaX, currentContentRef.xy[1] + deltaY]);
        });

        // 把any-touch的事件冒泡到any-scroll
        at.on('at:after', e => {
            this.emit(e.name, e);
        })
    }

    update() {
        // 通知每个contentRef计算属性
        this.__contentRefList.forEach((contentRef) => {
            contentRef.update();
        });
        this.emit('update');
    }

    /**
     * 根据元素找contentRef
     * @param targetEl
     * @returns
     */
    findContentRef(targetEl: HTMLElement) {
        for (let ref of this.__contentRefList) {
            // 目标元素是否content元素的子元素
            if (ref.el.contains(targetEl)) {
                this.emit('change-content', ref);
                return ref;
            }
        }
        return null;
    }

    moveTo(distXY: readonly [number, number]) {
        return this.currentContentRef?.moveTo(distXY);
    }

    scrollTo(distXY: [number, number], duration = 1000, easing?: (t: number) => number) {
        this.currentContentRef?.scrollTo(distXY, duration, easing);
    }

    dampScroll(distXY: readonly [number, number], damping = this.options.damping) {
        this.currentContentRef?.dampScroll(distXY, damping);
    }

    /**
     * 立即停止滑动
     */
    stop() {
        this.currentContentRef?.stop();
    }

    /**
     * 获取content实例
     * @param elOrIndex 元素或者索引
     * @returns
     */
    getContentRef(elOrIndex?: HTMLElement | number) {
        // 不传参数, 返回默认ref
        if (void 0 === elOrIndex) {
            return this.currentContentRef || this.__contentRefList[0];
        }

        // 传入元素
        if (isElement(elOrIndex)) {
            return (
                this.__contentRefList.find(({ el }) => {
                    return el === elOrIndex;
                }) || null
            );
        }
        // 传入数字
        else {
            return this.__contentRefList[Number(elOrIndex)] || null;
        }
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
