import AnyTouch from 'any-touch';
import AnyEvent from 'any-event';

import ResizeObserver from 'resize-observer-polyfill';
import isElement from 'lodash/isElement';
import Content from './content';
import { SCROLL_END_DELAY } from './const';
import { setStyle } from '@any-scroll/shared';
const { setTimeout } = window;
// declare const WebKitMutationObserver: MutationObserver;
// declare const MozMutationObserver: MutationObserver;

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
    // 是否允许滑动出界限, 超过tolerance
    // limit?: [XY,XY];
    hasBar?: boolean;

    watchResize?: boolean;
}

export const DEFAULT_OPTIONS = {
    overflowDistance: 100,
    damping: 0.1,
    allow: [true, true] as [boolean, boolean],
    hideBar: [false, false] as [boolean, boolean],
    snap: true,
    hasBar: true,
    watchResize: true,
};

type ContentRefList = InstanceType<typeof Content>[];

const plugins: any[] = [];
export default class extends AnyEvent {
    /**
     * 加载插件
     * @param plugin 插件
     */
    static use(plugin: any) {
        plugins.push(plugin);
    }
    el: HTMLElement;
    // size: [number, number] = [0, 0];
    // contentSize: [number, number] = [0, 0];
    targets: (EventTarget | null)[] = [];

    options: Required<Options>;
    // 当前content实例
    currentContentRef: InstanceType<typeof Content> | null;

    // 存储content实例和元素
    private __contentRefList: ContentRefList = [];
    
    constructor(el: HTMLElement, options?: Options) {
        super();
        const at = new AnyTouch(el);
        this.el = el;
        this.options = { ...DEFAULT_OPTIONS, ...options };
        const { allow } = this.options;

        setStyle(el, {
            position: `relative`,
            overflow: 'hidden',
        });



        // 遍历content元素
        // ⭐生成Content实例
        Array.from(el.children).forEach((contentEl) => {
            const ref = new Content(contentEl as HTMLElement, el, this.options);
            ref.on('resize', () => {
                this.update();
            });

            ref.on('scroll', (arg) => {
                clearTimeout(ref.__scrollEndTimeId);
                this.emit('scroll', arg);
            });

            ref.on('scroll-end', (arg) => {
                this.emit('scroll-end', arg);
            });

            this.__contentRefList.push(ref);
        });

        // 默认contentRef为第一个contentRef
        this.currentContentRef = this.getContentRef();
        this.emit('mounted', this);


        // 加载插件
        plugins.forEach((plugin) => {
            plugin(this);
        });

        // 监视尺寸变化
        if (this.options.watchResize) {
            const ro = new ResizeObserver(this.update.bind(this));
            ro.observe(el);
        }

        // 代理所有手势事件
        at.on('at:after', e => {
            this.emit(e.type, e);
        });


        at.on(['panstart', 'panmove'], (e) => {
            const { currentContentRef: __currentContentRef } = this;
            if (null !== __currentContentRef) {
                this.targets = e.targets;
                const { deltaX, deltaY } = e;
                const { xy } = __currentContentRef;
                __currentContentRef.moveTo([xy[0] + deltaX, xy[1] + deltaY]);
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
        swipe && swipe.set({ velocity: 1 });
        at.on('swipe', (e) => {
            this.targets = e.targets;
            // clearTimeout(this._scrollEndTimeId);
            const deltaX = e.speedX * 200;
            const deltaY = e.speedY * 200;
            this.currentContentRef?.dampScroll([
                this.currentContentRef.xy[0] + deltaX,
                this.currentContentRef.xy[1] + deltaY,
            ]);
        });
    }

    update() {
        this.__contentRefList.forEach((contentRef) => {
            contentRef.update();
        });
        this.emit('resize');
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

    dampScroll(distXY: readonly [number, number]) {
        this.currentContentRef?.dampScroll(distXY);
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
        super.destroy();
    }
}
