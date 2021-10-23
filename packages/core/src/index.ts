import AnyTouch from 'any-touch';

import raf from 'raf';
import debounce from 'lodash/debounce';
import inRange from 'lodash/inRange';

import clamp from 'lodash/clamp';
// function clamp(a: number, b: number, c: number) {
//     return _clamp(a, Math.min(b, c), Math.max(b, c));
// }
import createBar from '@any-scroll/bar';
import { setStyle, damp, tween, setTranslate, runTwice } from '@any-scroll/shared';
import Content from './content';
import watchWheel from './wheel';

import { STYLE, CONTENT_STYLE, SCROLL_END_DELAY, CLASS_NAME_ANY_SCROLL } from './const';
const { setTimeout } = window;

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
    // 是否允许滑动出界限, 超过tolerance
    // limit?: [XY,XY];
}

export const DEFAULT_OPTIONS = {
    overflowDistance: 100,
    damping: 0.1,
    allow: [true, true] as [boolean, boolean],
    hideBar: [false, false] as [boolean, boolean],
    snap: true,
};

type ContentRefList = {
    el: HTMLElement;
    ref: InstanceType<typeof Content>
}[];

export default class extends AnyTouch {
    private __minXY: [number, number] = [0, 0];
    private __maxXY: [number, number] = [0, 0];

    private size: [number, number] = [0, 0];
    private __options: Required<Options>;
    private __updateBar: any;
    contentSize: [number, number] = [0, 0];
    contentRefList: ContentRefList = [];

    targets: (EventTarget | null)[] = [];
    // 控制scroll-end不被频繁触发
    private _scrollEndTimeId = -1;
    // 当前content实例
    private __currentContentRef: InstanceType<typeof Content> | null;

    constructor(el: HTMLElement, options?: Options) {
        super(el);
        setStyle(el, { position: `relative`, overflow: 'hidden' })
        this.__options = { ...DEFAULT_OPTIONS, ...options };

        // 遍历content元素
        // 生成实例
        Array.from(el.children).forEach(contentEl => {
            const ref = new Content(contentEl as HTMLElement, el, this.__options);
            this.contentRefList.push({ el: contentEl as HTMLElement, ref })
        });

        this.__currentContentRef = this.contentRefList[0].ref;
        // const __currentContentRefXY = this.__currentContentRef.xy;

        // this.__updateBar = createBar(el);


        // this.__updateSize();
        // this.__updateBar(this.contentRef.xy, this.size, this.__minXY, this.contentSize);
        // this.__registerObserver();

        this.on(['panstart', 'panmove'], (e) => {
            this.targets = e.targets;
            const { deltaX, deltaY } = e;
            this.__currentContentRef?.moveTo([this.__currentContentRef.xy[0] + deltaX, this.__currentContentRef.xy[1] + deltaY]);
        });

        this.on('panend', (e) => {
            this._scrollEndTimeId = setTimeout(() => {
                this.targets = e.targets;
                this.emit('scroll-end', this.__currentContentRef!.xy);
            }, SCROLL_END_DELAY);
        });

        this.on('at:start', e => {
            const targetEl = e.target as HTMLElement;
            console.log(targetEl);
            this.__currentContentRef = null
            for (let { ref, el } of this.contentRefList) {
                if (el.contains(targetEl)) {
                    this.__currentContentRef = ref;
                    break;
                }
            }
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
        console.log(this);

        watchWheel(el, ({ type, deltaY, vx, vy, target }) => {
            if (null === this.__currentContentRef) return;
            const { xy } = this.__currentContentRef;
            this.targets = [target];
            if ('start' === type) {
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

    // update() {
    //     console.warn('update');
    //     this.__updateSize();
    //     this.__updateBar(this.contentRef.xy, this.size, this.__minXY, this.contentSize);
    // }

    // /**
    //  * 更新尺寸
    //  */
    // private __updateSize() {
    //     const { wrapEl, contentEl } = this;
    //     const { offsetWidth, offsetHeight, clientWidth, clientHeight, scrollWidth, scrollHeight } = contentEl;
    //     // scrollView尺寸
    //     this.size = [wrapEl.clientWidth, wrapEl.clientHeight];

    //     // 内容尺寸
    //     // 保留边框
    //     // 参考smooth-scroll
    //     this.contentSize = [offsetWidth - clientWidth + scrollWidth, offsetHeight - clientHeight + scrollHeight];

    //     this.__minXY = [
    //         Math.min(0, this.size[0] - this.contentSize[0]),
    //         Math.min(0, this.size[1] - this.contentSize[1]),
    //     ];

    //     this.__maxXY = [0, 0];

    //     console.log('__warpSize', this.size);
    //     console.log('contentSize', this.contentSize);
    //     console.log('__minXY', this.__minXY);
    //     console.log('__maxXY', this.__maxXY);

    // }

    // /**
    //  * 注册监听
    //  */
    // __registerObserver() {
    //     window.addEventListener('resize', this.update.bind(this));
    //     const Observer = MutationObserver || WebKitMutationObserver || MozMutationObserver;
    //     // observe
    //     if (typeof Observer === 'function') {
    //         const ob = new Observer(this.update.bind(this));
    //         ob.observe(this.contentEl, {
    //             subtree: true,
    //             childList: true,
    //         });
    //     }
    // }
    // /**
    //  * 立即停止滑动
    //  */
    // stop() {
    //     raf.cancel(this._dampScrollRafId);
    //     this._stopScroll();
    // }

    // /**
    //  * 吸附到最近的边缘
    //  */
    // snap() {
    //     if (this.__options.snap) {
    //         // console.log('snap');
    //         const xy = runTwice(i => {
    //             return clamp(this.contentRef.xy[i], this.__minXY[i], this.__maxXY[i]);
    //         });
    //         this._dampScroll(xy);
    //     }
    // }

    // /**
    //  * 设置位置
    //  * @param x
    //  * @param y
    //  * @returns
    //  */
    // moveTo(distXY: readonly [number, number]): [number, number] {
    //     clearTimeout(this._scrollEndTimeId);
    //     const { allow, overflowDistance } = this.__options;
    //     runTwice((i) => {
    //         if (allow[i]) {
    //             this.contentRef.xy[i] = clamp(
    //                 distXY[i],
    //                 this.__minXY[i] - overflowDistance,
    //                 this.__maxXY[i] + overflowDistance
    //             );
    //         }
    //     });

    //     if (allow.includes(true)) {
    //         const [x, y] = this.contentRef.xy;
    //         const { targets } = this;
    //         const target = targets[0];
    //         // 钩子
    //         this.emit('scroll', { targets, target, x, y });
    //         const { clientWidth, clientHeight } = this.wrapEl;
    //         this.__updateBar(this.contentRef.xy, [clientWidth, clientHeight], this.__minXY, this.contentSize);
    //         setTranslate(this.contentEl, ...this.contentRef.xy);
    //     }
    //     return this.contentRef.xy;
    // }

    // scrollTo(distXY: [number, number], duration = 1000) {
    //     const [run, stop, done] = tween(this.contentRef.xy, distXY, duration);
    //     run(this.moveTo.bind(this));
    //     this._stopScroll = stop;
    //     done(() => {
    //         this.snap();
    //         // console.log('done');
    //     });
    // }

    // /**
    //  * 手势对应的滚动逻辑
    //  * 和对外的scrollTo的区别是:与时间无关的迭代衰减
    //  * @param distXY 目标点
    //  * @param onScroll 滚动回调
    //  */
    // _dampScroll(distXY: readonly [number, number]) {
    //     if (distXY[0] === this.contentRef.xy[0] && distXY[1] === this.contentRef.xy[1]) return;

    //     raf.cancel(this._dampScrollRafId);
    //     // console.log('_dampScroll', distXY, this.contentRef.xy);
    //     // 参数
    //     const { overflowDistance, allow } = this.__options;

    //     // 内部状态, 根据不同位置会发生变化
    //     const _distXY = [...distXY] as [number, number];

    //     // AnyScroll实例
    //     type AnyScrollInstance = typeof this;
    //     function _moveTo(context: AnyScrollInstance) {
    //         const { xy, __minXY, __maxXY } = context;

    //         // 获取当前值
    //         const _nextXY = runTwice((i) => {
    //             // 根据当前位置和目标计算阶"段性的目标位置"
    //             const _nextvalue = damp(context.xy[i], _distXY[i]);
    //             // console.log(i, { _nextvalue }, context.xy[i], _distXY[i]);
    //             // 当前位置和目标都超过了界限
    //             if (xy[i] >= __maxXY[i] + overflowDistance && _distXY[i] >= __maxXY[i] + overflowDistance) {
    //                 // console.log(1);
    //                 // 复位
    //                 // _distXY[i] = 0;
    //                 _distXY[i] = __maxXY[i];
    //             }
    //             // 当前已经到达目标, 且位置超出的边框
    //             // else if (_nextvalue == _distXY[i] && _nextvalue > 0) {
    //             else if (_nextvalue == _distXY[i] && _nextvalue > __maxXY[i]) {
    //                 // console.log(2);
    //                 // _distXY[i] = 0;
    //                 _distXY[i] = __maxXY[i];

    //             } else if (xy[i] < __minXY[i] && _distXY[i] < __minXY[i]) {
    //                 // console.log(3, __minXY[i]);
    //                 _distXY[i] = __minXY[i];
    //             } else if (_nextvalue == _distXY[i] && _nextvalue < __minXY[i]) {
    //                 // console.log(4);
    //                 _distXY[i] = __minXY[i];
    //             } else {
    //                 // console.log(5);

    //                 return _nextvalue;
    //             }
    //             return damp(context.xy[i], _distXY[i]);
    //         });

    //         context.moveTo(_nextXY);
    //         // console.log(allow,`_nextXY`, _nextXY, 'distXY', _distXY,);

    //         // 是否开启的轴已经滚动到终点
    //         const _needScroll = runTwice((i) => allow[i] && _distXY[i] !== _nextXY[i]).some((bool) => bool);

    //         // 迭代 OR 跳出迭代
    //         if (_needScroll) {
    //             // console.log(_distXY, _nextXY);
    //             context._dampScrollRafId = raf(() => {
    //                 _moveTo(context);
    //             });
    //         } else {
    //             // console.log(_distXY, _nextXY);
    //             // _scrollTo(context);
    //             context.emit('scroll-end');
    //         }
    //     }
    //     _moveTo(this);
    // }

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
function getContentDOM(el: HTMLElement) {
    // 设置外容器样式
    setStyle(el, STYLE);
    el.classList.add(CLASS_NAME_ANY_SCROLL);
    // 生成内容器, 并把外容器内的dom移动到内容器
    const contentEl = el.firstElementChild as HTMLElement;
    // 设置内容器样式
    if (null !== contentEl) {
        setStyle(contentEl, CONTENT_STYLE);
        return contentEl;
    } else {
        throw '请增加body元素!';
    }
}


function createScrollEvent(event: Record<string, any>, xy: XY) {
    const { targe, targets } = event;
    const [x, y] = xy;
    return { targe, targets, x, y, xy };
}