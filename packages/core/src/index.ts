import dist from 'any-event';
import AnyTouch from 'any-touch'
import raf from 'raf';
import debounce from 'lodash/debounce';
import clamp from 'lodash/clamp';
import inRange from 'lodash/inRange';
const { setTimeout } = window;

const STYLE: Partial<CSSStyleDeclaration> = {
    overflow: 'hidden',
};
const CONTENT_STYLE: Partial<CSSStyleDeclaration> = {
    width: '100%'
};

export default function (el: HTMLElement, { tolerance = 150, damping = 0.1 } = {}) {
    const OVERFLOW_ANIMATE_DURATION = 96;
    // 内容元素当前位移
    let x = 0;
    let y = 0;
    let rafIdX = -1;
    let rafIdY = -1;

    // 设置外容器样式
    for (const key in STYLE) {
        el.style.setProperty(key, STYLE[key] as string);
    }

    // 生成内容器, 并把外容器内的dom移动到内容器
    const contentEl = document.createElement('div');

    while (el.firstChild) {
        contentEl.appendChild(el.firstChild);
    }
    // 设置内容器样式
    for (const key in CONTENT_STYLE) {
        contentEl.style.setProperty(key, CONTENT_STYLE[key] as string);
    }
    el.appendChild(contentEl);

    const MIN_X = el.offsetWidth - contentEl.scrollWidth;
    const MIN_Y = el.offsetHeight - contentEl.scrollHeight;



    // 加载手势
    const at = new AnyTouch(el, { preventDefaultExclude: e=>{
        console.log(e);
        return false;
    } });
    at.on('panmove', e => {
        const { deltaX, deltaY } = e;
        _setXY([x + deltaX, y + deltaY]);
    });

    at.on('at:end', e => {
        __snap();
    });

    at.on('at:start', e => {
        raf.cancel(rafIdX);
        raf.cancel(rafIdY);
        // _scrollTo([1110, 400]);
    });

    const swipe = at.get('swipe');
    swipe && swipe.set({ velocity: 1 });

    at.on('swipe', e => {
        let dx = e.speedX * 300;
        let dy = e.speedY * 300;
        _scrollTo([x + dx, y + dy]);
    });

    /**
     * 设置xy
     * @param distXY 目标点
     * @returns 返回当前xy 
     */
    function _setXY([distX, distY]: [number, number]): [number, number] {
        x = distX;
        y = distY;
        contentEl.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`);
        return [x, y];
    }

    function __nextTick(from: number, to: number, callback: (value: number, rafId: number) => void) {
        nextTick(to - from, (n, rafId2) => {
            callback(from + n, rafId2);
        }, damping);
    }

    function __snap() {
        _scrollTo([clamp(x, MIN_X, 0), clamp(y, MIN_Y, 0)]);
    }

    /**
     * 
     * @param distXY 目标点
     * @param onScroll 滚动回调
     * @param isShrink 是否收缩滚动, 用来防止回滚中再次执行回滚
     */
    function _scrollTo(
        [distX, distY]: [number, number],
        onScroll = (([x, y]: [number, number]) => void 0),
        isShrink = [false, false],
    ) {
        // y轴变化,也会触发scrollTo, 
        // 如果x==distX, 
        // 说明x轴不动
        if (x !== distX) {
            raf.cancel(rafIdX);
            const startX = x;
            const MIN_X = el.offsetWidth - contentEl.scrollWidth;
            // console.warn(0,clamp(distY, MIN_Y - tolerance, tolerance));
            __nextTick(startX, clamp(distX, MIN_X - tolerance, tolerance), (newX, rafId) => {
                const currentX = newX;
                rafIdX = rafId;
                onScroll(_setXY([newX, y]));
                if (!isShrink[0] && 0 < currentX) {
                    delay(() => {
                        0
                        _scrollTo([0, y], onScroll, [true, isShrink[1]]);
                    });
                } else if (!isShrink[0] && MIN_X > currentX) {
                    delay(() => {
                        _scrollTo([MIN_X, y], onScroll, [true, isShrink[1]]);
                    });
                }
            });
        }

        if (y !== distY) {
            raf.cancel(rafIdY)
            const startY = y;
            const MIN_Y = el.offsetHeight - contentEl.scrollHeight;
            // console.warn(1,clamp(distY, MIN_Y - tolerance, tolerance));
            __nextTick(startY, clamp(distY, MIN_Y - tolerance, tolerance), (newY, rafId) => {
                const currentY = newY;
                rafIdY = rafId;
                onScroll(_setXY([x, newY]));
                if (!isShrink[1] && 0 < currentY) {
                    delay(() => {
                        _scrollTo([x, 0], onScroll, [isShrink[0], true]);
                    });
                } else if (!isShrink[1] && MIN_Y > currentY) {
                    delay(() => {
                        _scrollTo([x, MIN_Y], onScroll, [isShrink[0], true]);
                    });
                }
            });
        }

    }

}
/**
 * 封装settimeout
 * @param callback 
 * @param duration 默认延迟96ms
 */
function delay(callback: () => void, duration = 96) {
    setTimeout(() => {
        callback();
    }, duration);
}

function getValidPostion([el, contentEl]: [HTMLElement, HTMLElement], [x, y]: [number, number], [dx, dy]: [number, number], tolerance: number = 50, damping = 0.5): [number, number] {
    // 目标坐标
    let distX = x + dx;
    let distY = y + dy;

    const MIN_X = el.offsetWidth - contentEl.scrollWidth - tolerance
    if (MIN_X > distX) {
        distX = MIN_X;
    } else if (MIN_X + tolerance > distX && MIN_X <= distX) {
        distX = x + dx * damping;
    } else if (0 >= distX) {
        // distX = Math.max(y, el.offsetWidth - contentEl.scrollWidth - tolerance);
    } else if (tolerance > distX) {
        distX = x + dx * damping;
    } else {
        distX = tolerance
    }
    const MIN_Y = el.offsetHeight - contentEl.scrollHeight - tolerance

    // 超出容差
    if (MIN_Y > distY) {
        distY = MIN_Y;
    }
    // 底部容差内
    else if (MIN_Y + tolerance > distY && MIN_Y <= distY) {
        distY = y + dy * damping;
    }
    // 正常范围内
    else if (0 >= distY) {
        // distY = Math.max(y, el.offsetHeight - contentEl.scrollHeight - tolerance);
    }
    // 上部容差范围内
    else if (tolerance > distY) {
        distY = y + dy * damping;
    }
    // 超出上部容差
    else {
        distY = tolerance;
    }
    return [distX, distY];
}

/**
 * 设置元素的translate
 * @param el 元素
 * @param start 起始坐标 
 * @param delatX 坐标变化增量
 * @param tolerance 容差
 * @param damping 超过边界的时候变化量的衰减系数(线性关系)
 * @returns 目标坐标
 */
function _setContentTranslate([el, contentEl]: [HTMLElement, HTMLElement], [x, y]: [number, number], [dx, dy]: [number, number], tolerance: number = 50, damping = 0.5): [number, number] {
    // 目标坐标
    let distX = x + dx;
    let distY = y + dy;

    const MIN_X = el.offsetWidth - contentEl.scrollWidth - tolerance
    const MIN_Y = el.offsetHeight - contentEl.scrollHeight - tolerance
    if (MIN_X > distX) {
        distX = MIN_X;
    } else if (MIN_X + tolerance > distX && MIN_X <= distX) {
        distX = x + dx * damping;
    } else if (0 >= distX) {
        // distX = Math.max(y, el.offsetWidth - contentEl.scrollWidth - tolerance);
    } else if (tolerance > distX) {
        distX = x + dx * damping;
    } else {
        distX = tolerance
    }

    // 超出容差
    if (MIN_Y > distY) {
        distY = MIN_Y;
        // console.log(1);
    }
    // 底部容差内
    else if (MIN_Y + tolerance > distY && MIN_Y <= distY) {
        distY = y + dy * damping;
        // console.log(2);
    }
    // 正常范围内
    else if (0 >= distY) {
        // console.log(555);
        // distY = Math.max(y, el.offsetHeight - contentEl.scrollHeight - tolerance);
    }
    // 上部容差范围内
    else if (tolerance > distY) {
        // console.log(3, distY, tolerance);

        distY = y + dy * damping;
    }
    // 超出上部容差
    else {
        distY = tolerance;
        // console.log(4);
    }



    contentEl.style.setProperty('transform', `translate3d(${distX}px, ${distY}px, 0)`);
    return [distX, distY];
}
/**
 * 
 * @param elements 
 * @param from 
 * @param delta 
 * @param duration 
 * @param onScroll 
 * @param onChangeRaf 
 */
function _scrollByTime([el, contentEl]: [HTMLElement, HTMLElement], [x, y]: [number, number], deltaXY: [number, number], duration: number, onScroll: ([x, y]: [number, number]) => void, onChangeRaf?: (id: number) => void, onDone?: () => void) {
    let startTime = Date.now();

    const [distX, distY] = getResetPosition([el, contentEl], [x + deltaXY[0], y + deltaXY[1]]);
    const [dx, dy] = [distX - x, distY - y];

    function animate() {
        const timeDiff = Date.now() - startTime;
        if (duration > timeDiff) {
            const activeXY: [number, number] = [easeOut(timeDiff, x, dx, duration), easeOut(timeDiff, y, dy, duration)];
            _setContentTranslate([el, contentEl], [x, y], [activeXY[0] - x, activeXY[1] - y], 50, 1);
            onChangeRaf && onChangeRaf(raf(animate));
            onScroll && onScroll(activeXY);
            console.log(activeXY, timeDiff);
        } else {
            const activeXY = _setContentTranslate([el, contentEl], [x, y], [dx, dy], 50, 1);
            onScroll && onScroll(activeXY);
            onDone && onDone();
            console.log(activeXY, timeDiff);
        }
    }
    animate()
}
/**
 * 参考 https://github.com/zhangxinxu/Tween/blob/master/tween.js
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）。
*/
function easeOut(t: number, b: number, c: number, d: number) {
    return -c * (t /= d) * (t - 2) + b;
}

/**
 * 获取最近的边界位置
 * @param elements 外壳和内容元素
 * @param postion 当前位置
 * @returns 边界位置
 */
function getResetPosition([el, contentEl]: [HTMLElement, HTMLElement], [x, y]: [number, number]): [number, number] {
    const MIN_X = el.offsetWidth - contentEl.scrollWidth;
    const MAX_X = 0;
    const MIN_Y = el.offsetHeight - contentEl.scrollHeight;
    const MAX_Y = 0;
    if (MIN_X > x) {
        x = MIN_X
    } else if (MAX_X < x) {
        x = MAX_X;
    }

    if (MIN_Y > y) {
        y = MIN_Y
    } else if (MAX_Y < y) {
        y = MAX_Y;
    }
    return [x, y];
};


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