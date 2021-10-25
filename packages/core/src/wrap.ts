import AnyTouch from 'any-touch';

import raf from 'raf';
import debounce from 'lodash/debounce';
import inRange from 'lodash/inRange';

import isElement from 'lodash/isElement';

import { setStyle, damp, tween, setTranslate, runTwice } from '@any-scroll/shared';
import Content from './content';
import watchWheel from './wheel';

import { STYLE, CONTENT_STYLE, SCROLL_END_DELAY, CLASS_NAME_ANY_SCROLL } from './const';
const { setTimeout } = window;

export type XY = [number, number];

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
}

export const DEFAULT_OPTIONS = {
    overflowDistance: 100,
    damping: 0.1,
    allow: [true, true] as [boolean, boolean],
    hideBar: [false, false] as [boolean, boolean],
    snap: true,
    hasBar: true,
};

type ContentRefList = InstanceType<typeof Content>[];

const plugins: any[] = [];
export default class extends AnyTouch {
    /**
     * 加载插件
     * @param plugin 插件
     */
    static use(plugin: any) {
        plugins.push(plugin);
    }

    // size: [number, number] = [0, 0];
    // contentSize: [number, number] = [0, 0];
    targets: (EventTarget | null)[] = [];

    private __options: Required<Options>;
    // 控制scroll-end不被频繁触发
    private _scrollEndTimeId = -1;
    // 存储content实例和元素
    private __contentRefList: ContentRefList = [];
    // 当前content实例
    private __currentContentRef: InstanceType<typeof Content> | null;

    constructor(el: HTMLElement, options?: Options) {
        super(el);
        el.classList.add('any-scroll');
        // setStyle(el, { position: `relative`, overflow: 'hidden' });
        this.__options = { ...DEFAULT_OPTIONS, ...options };

        // 遍历content元素
        // 生成实例
        Array.from(el.children).forEach(contentEl => {
            const ref = new Content(contentEl as HTMLElement, el, this.__options);

            this.__contentRefList.push(ref)
        });

        // 默认
        this.__currentContentRef = this.getContentRef();

        if (this.__currentContentRef) {
            this.__currentContentRef.on('scroll', arg => {
                this.emit('scroll', arg);
            });

            this.__currentContentRef.on('scroll-end', arg => {
                this.emit('scroll-end', arg);
            });
        }

        // 加载插件
        plugins.forEach(plugin => {
            plugin(this);
        })

        // this.__updateSize();
        // this.__updateBar(this.contentRef.xy, this.size, this.__minXY, this.contentSize);
        // this.__registerObserver();

        this.on(['panstart', 'panmove'], (e) => {
            const { __currentContentRef } = this;
            if (null !== __currentContentRef) {
                this.targets = e.targets;
                const { deltaX, deltaY } = e;
                __currentContentRef.moveTo([__currentContentRef.xy[0] + deltaX, __currentContentRef.xy[1] + deltaY]);
            }
        });

        this.on('panend', (e) => {
            this._scrollEndTimeId = setTimeout(() => {
                if (null !== this.__currentContentRef) {
                    this.targets = e.targets;
                    this.emit('scroll-end', this.__currentContentRef.xy);
                }
            }, SCROLL_END_DELAY);

        });

        this.on('at:start', e => {
            const targetEl = e.target as HTMLElement;
            this.__currentContentRef = this.__findContentRef(targetEl);
            this.__currentContentRef?.stop();
        });

        this.on('at:end', () => {
            this.__currentContentRef?.snap();
        });

        const swipe = this.get('swipe');
        swipe && swipe.set({ velocity: 1 });
        this.on('swipe', (e) => {
            this.targets = e.targets;
            console.log('swipe');
            clearTimeout(this._scrollEndTimeId);
            let deltaX = e.speedX * 220;
            let deltaY = e.speedY * 220;
            this.__currentContentRef?._dampScroll([this.__currentContentRef.xy[0] + deltaX, this.__currentContentRef.xy[1] + deltaY]);
        });

        const { allow } = this.__options;
        // 滚动鼠标X轴滑动
        const wheelX = allow[0] && !allow[1];

        watchWheel(el, ({ type, deltaY, vx, vy, target }) => {
            this.__currentContentRef = this.__findContentRef(target as HTMLElement);
            if (null === this.__currentContentRef) return;
            const { xy } = this.__currentContentRef;
            this.targets = [target];
            if ('start' === type) {
                // this.getContentRef()
                // console.log('wheel-start');
                this.__currentContentRef.stop();
                if (wheelX) {
                    this.__dampScroll([xy[0] - deltaY, xy[1]]);
                } else {
                    this.__dampScroll([xy[0], xy[1] - deltaY]);
                }
            } else if ('move' === type) {
                if (wheelX) {
                    this.__dampScroll([xy[0] - deltaY, xy[1]]);
                } else {
                    this.__dampScroll([xy[0], xy[1] - deltaY]);
                }
            } else if ('end' === type) {
                // console.warn('wheel-end')
                if (wheelX) {
                    this.__dampScroll([xy[0] - vy * 5, xy[1]]);
                } else {
                    this.__dampScroll([xy[0], xy[1] - Math.ceil(vy) * 30]);
                }
            }
        });
    }

    __findContentRef(targetEl: HTMLElement) {
        for (let ref of this.__contentRefList) {
            if (ref.el.contains(targetEl)) {
                return ref;
            }
        }
        return null;
    }

    moveTo(distXY: readonly [number, number]) {
        return this.__currentContentRef?.moveTo(distXY);
    }

    scrollTo(distXY: [number, number], duration = 1000) {
        this.__currentContentRef?.scrollTo(distXY, duration);
    }

    __dampScroll(distXY: readonly [number, number]) {
        this.__currentContentRef?._dampScroll(distXY);
    }

    /**
     * 立即停止滑动
     */
    stop() {
        this.__currentContentRef?.stop()
    }

    /**
     * 获取content实例
     * @param elOrIndex 元素或者索引 
     * @returns 
     */
    getContentRef(elOrIndex: HTMLElement | number = 0) {
        if (0 !== elOrIndex && isElement(elOrIndex)) {
            return this.__contentRefList.find(({ el }) => {
                return el === elOrIndex;
            }) || null;
        } else {
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