import AnyTouch from 'any-touch'
import raf from 'raf';
import debounce from 'lodash/debounce';
import clamp from 'lodash/clamp';
import createBar from '@any-scroll/bar';
import { setStyle } from '@any-scroll/shared';

declare const WebKitMutationObserver: MutationObserver;
declare const MozMutationObserver: MutationObserver;

const { setTimeout } = window;

const STYLE: Partial<CSSStyleDeclaration> = {
    overflow: 'hidden',
};
const CONTENT_STYLE: Partial<CSSStyleDeclaration> = {
    width: '100%',
};

const SHRINK_DELAY_TIME = 96;

export default function (el: HTMLElement, { tolerance = 150, damping = 0.1 } = {}) {
    // 内容元素当前位移
    let __x = 0;
    let __y = 0;
    // 给按距离滚动的函数使用
    let __rafIdX = -1;
    let __rafIdY = -1;
    // 给按时间和距离滚动的函数使用
    let __rafId = -1;


    /**
     * 监听所有的滚动
     * 用来扩展插件
     * @param param0 
     */
    function __onScroll([x, y]: [number, number], [minX, minY]: [number, number]) {
        __updateBar([x, y], [el.clientWidth, el.clientHeight, minX, minY]);
    }


    // 设置外容器样式
    setStyle(el, STYLE);
    el.classList.add('any-scroll');
    // 生成内容器, 并把外容器内的dom移动到内容器
    const contentEl = document.createElement('div');
    while (el.firstChild) {
        contentEl.appendChild(el.firstChild);
    }
    // 设置内容器样式
    setStyle(contentEl, CONTENT_STYLE);
    el.appendChild(contentEl);

    const __updateBar = createBar(el, (x,y,thumbWidth,thumbHeight) => {
        __setXY(
            x / (el.clientWidth - thumbWidth) * MIN_X, 
            y / (el.clientHeight - thumbHeight)* MIN_Y);
    });

    let MIN_X = 0;
    let MIN_Y = 0;

    /**
     * 更新尺寸
     */
    function __updateSize() {
        console.log('update-size');
        // 保留边框
        // 参考smooth-scroll
        const contentWidth = contentEl.offsetWidth - contentEl.clientWidth + contentEl.scrollWidth;
        const contentHeight = contentEl.offsetHeight - contentEl.clientHeight + contentEl.scrollHeight;
        MIN_X = el.clientWidth - contentWidth;
        MIN_Y = el.clientHeight - contentHeight;
    }

    /**
     * 注册监听
     */
    function __registerObserver() {
        window.addEventListener('resize', __updateSize);
        const Observer = MutationObserver || WebKitMutationObserver || MozMutationObserver;
        // observe
        if (typeof Observer === 'function') {
            const ob = new Observer(__updateSize);
            ob.observe(contentEl, {
                subtree: true,
                childList: true,
            });
        }
    }

    __updateSize();
    __registerObserver();


    // 加载手势
    const at = new AnyTouch(el);
    at.on('panmove', e => {
        const is = (e.target as HTMLElement).classList.contains('scroll-bar-track') ||
            (e.target as HTMLElement).classList.contains('scroll-bar-thumb')
        console.log(e.target);
        if (!is) {
            const { deltaX, deltaY } = e;
            __setXY(__x + deltaX, __y + deltaY);
        }
    });

    at.on('at:end', e => {
        __snap();
    });

    at.on('at:start', e => {
        raf.cancel(__rafId);
        raf.cancel(__rafIdX);
        raf.cancel(__rafIdY);
    });

    const swipe = at.get('swipe');
    swipe && swipe.set({ velocity: 1 });

    at.on('swipe', e => {
        let dx = e.speedX * 300;
        let dy = e.speedY * 300;
        __scrollTo([__x + dx, __y + dy]);
    });

    /**
     * 设置xy
     * @param distXY 目标点
     * @returns 返回当前xy 
     */
    function __setXY(distX: number, distY: number): [number, number] {
        __x = distX;
        __y = distY;
        contentEl.style.setProperty('transform', `translate3d(${__x}px, ${__y}px, 0)`);
        return [__x, __y];
    }

    function __nextTick(from: number, to: number, callback: (value: number, rafId: number) => void) {
        nextTick(to - from, (n, rafId) => {
            callback(from + n, rafId);
        }, damping);
    }

    function __snap() {
        __scrollTo([clamp(__x, MIN_X, 0), clamp(__y, MIN_Y, 0)]);
    }

    /**
     * swipe对应的滚动逻辑
     * 和对外的scrollTo的区别是:与时间无关的迭代衰减
     * @param distXY 目标点
     * @param onScroll 滚动回调
     * @param isShrink 是否收缩滚动, 用来防止回滚中再次执行回滚
     */
    function __scrollTo(
        [distX, distY]: [number, number],
        onScroll = (([x, y]: [number, number]) => void 0),
        isShrink = [false, false],
    ) {
        // y轴变化,也会触发scrollTo, 
        // 如果x==distX, 
        // 说明x轴不动
        if (__x !== distX) {
            raf.cancel(__rafIdX);
            const startX = __x;
            // console.warn(0,clamp(distY, MIN_Y - tolerance, tolerance));
            __nextTick(startX, clamp(distX, MIN_X - tolerance, tolerance), (newX, rafId) => {
                const currentX = newX;
                __rafIdX = rafId;
                const _xy = __setXY(newX, __y);
                onScroll(_xy);
                __onScroll(_xy, [MIN_X, MIN_Y]);
                if (!isShrink[0] && 0 < currentX) {
                    delay(() => {
                        0
                        __scrollTo([0, __y], onScroll, [true, isShrink[1]]);
                    });
                } else if (!isShrink[0] && MIN_X > currentX) {
                    delay(() => {
                        __scrollTo([MIN_X, __y], onScroll, [true, isShrink[1]]);
                    });
                }
            });
        }

        if (__y !== distY) {
            raf.cancel(__rafIdY)
            const startY = __y;
            // console.warn(1,clamp(distY, MIN_Y - tolerance, tolerance));
            __nextTick(startY, clamp(distY, MIN_Y - tolerance, tolerance), (newY, rafId) => {
                const currentY = newY;
                __rafIdY = rafId;
                const _xy = __setXY(__x, newY);
                onScroll(_xy);
                __onScroll(_xy, [MIN_X, MIN_Y]);
                if (!isShrink[1] && 0 < currentY) {
                    delay(() => {
                        __scrollTo([__x, 0], onScroll, [isShrink[0], true]);
                    });
                } else if (!isShrink[1] && MIN_Y > currentY) {
                    delay(() => {
                        __scrollTo([__x, MIN_Y], onScroll, [isShrink[0], true]);
                    });
                }
            });
        }
    }

    /**
     * 按时间滚动
     * @param distX 
     * @param distY 
     * @param duration 
     * @param done 
     */
    function scrollTo(distX: number, distY: number, duration: number, done?: () => void) {
        raf.cancel(__rafId);
        const startTime = Date.now();
        const distanceX = clamp(distX, MIN_X, 0) - __x;
        const distanceY = clamp(distY, MIN_Y, 0) - __y;
        __scrollToOnTime([__x, __y], [distanceX, distanceY], startTime, duration);
    }


    function __scrollToOnTime([startX, startY]: [number, number], [distanceX, distanceY]: [number, number], startTime: number, duration: number) {
        const elapse = Date.now() - startTime;
        const progress = Math.min(1, easeOutCubic(elapse / duration));
        const distX = startX + distanceX * progress;
        const distY = startY + distanceY * progress;
        // console.log(distX, distY, elapse);
        __onScroll([distX, distY], [MIN_X, MIN_Y]);
        if (duration >= elapse) {
            __setXY(distX, distY);
            __rafId = raf(() => {
                __scrollToOnTime([startX, startY], [distanceX, distanceY], startTime, duration);
            });
        }
    }
    scrollTo(-1000, -100, 1000)
}

/**
 * 封装settimeout
 * @param callback 
 * @param duration 默认延迟96ms
 */
function delay(callback: () => void, duration = SHRINK_DELAY_TIME) {
    setTimeout(() => {
        callback();
    }, duration);
}

/**
 * 数字自增
 * @param total 总数字
 * @param each 获取当前值的函数
 * @param damping 衰减系数,范围0~1
 * @param startValue 起始值
 */
function nextTick(total: number, each: (n: number, rafId: number) => void, damping: number, startValue = 0) {
    // total需要大于0.1
    let rafId = -1;
    startValue += damping * (total - startValue);
    if (0.1 < Math.abs(total - startValue)) {
        rafId = raf(() => {
            nextTick(total, each, damping, startValue);
        });
    } else {
        startValue = total;
    }
    each(startValue, rafId);
    return () => { raf.cancel(rafId) };
}

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}