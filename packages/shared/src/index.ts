import raf from 'raf';
/**
 * 坐标
 */
export type XY = readonly [number, number] | { readonly x: number, readonly y: number };

/**
 * 统一xy的表现形式为[x,y]
 * @param xy
 * @returns [x,y]形式的坐标
 */
export function xY2Tuple(xy: XY, defaultXY: readonly [number, number]): readonly [number, number] {
    if ('x' in xy || 'y' in xy) {
        return [xy.x || defaultXY[0], xy.y || defaultXY[1]] as const;
    }
    return runTwice(i => xy[i] || defaultXY[i]);
}

/**
 * 轴线
 */
export const enum Axis {
    X = 'x',
    Y = 'y',
}

export const AxisList = [Axis.X, Axis.Y];

export function setStyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    for (const key in styles) {
        el.style[key] = styles[key] || '';
        // el.style.setProperty(key, styles[key] as string);
    }
}

/**
 * 位移渲染函数
 * @param el 元素
 * @param param 位移x和y
 */
export function render(el: HTMLElement, [x, y]: readonly [number, number]) {
    setStyle(el, { transform: `translate3d(${x}px, ${y}px,0)` });
}

// export function appendStyleToHTML(style: string) {
//     const styleEl = document.createElement('style');
//     styleEl.textContent = style;
//     if (document.head) {
//         document.head.appendChild(styleEl);
//     }
// }

/**
 * 新建div
 * @param className class名 
 * @returns div
 */
export function createDOMDiv(className?: string[]) {
    const div = document.createElement(`div`);
    if (className) {
        div.classList.add(...className);
    }
    return div;
}

/**
 * 改变透明度
 * @param el 元素
 * @param opacity 透明度 
 */
export function changeOpacity(el: HTMLElement, opacity = 1) {
    setStyle(el, { opacity: String(opacity) });
}

/**
 * 改变dom显示/隐藏
 * @param el 元素
 * @param visible 是否显示
 */
export function changeDOMVisible(el: HTMLElement, visible = true) {
    const NONE = 'none';
    if (visible) {
        if (NONE === el.style.display) {
            setStyle(el, { display: '' });
        }
    } else {
        setStyle(el, { display: NONE });
    }
}

/**
 * 互动动画
 * @param t 0~1秒
 * @returns 
 */
export function easing(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

/**
 * 运行2次
 * @param callback 每次运行传入索引
 */
export function runTwice<T>(callback: (n: 0 | 1) => T): [T, T] {
    return [callback(0), callback(1)];
}

/**
 * 缓动变化
 * @param to 目标值, 起始值为[0]
 * @param duration 时间间隔
 * @returns [run, stop] 开始和停止函数
 * @example
 * const [run,stop] = tween([10, 30],[100,300], 1000);
 * run(console.log)
 */
export function tween<T extends number[]>(from: T, to: T, duration: number, easingFunction = easing) {
    // 防止from和to被外部改变
    const _from = [...from] as T;
    const _to = [...to] as T;

    const startTime = Date.now();
    let rafId = -1;
    let _onDone = () => { };
    const valueDiff = _to.map((n, i) => n - _from[i]);
    /**
     * 开始动画
     * @param onChange 每次变化执行函数, 参数是当前值
     */
    function run(onChange: (currentValue: T) => void) {
        rafId = raf(() => {
            const timeDiff = Date.now() - startTime;
            const timeProgress = timeDiff / duration;
            // 完成目标值比例
            const valueProgress = easingFunction(timeProgress);
            if (1 > timeProgress) {
                const currentValue = _from.map((n, i) => n + valueDiff[i] * valueProgress);
                onChange(currentValue as T);
                run(onChange);
            } else {
                onChange(_to);
                _onDone();
            }
        });
    }

    function onDone(cb: () => void) {
        _onDone = cb;
    }

    function stop() {
        raf.cancel(rafId);
    }

    return [run, stop, onDone] as const;
}

/**
 * 按比例减速逼近目标值
 * @param value 当前
 * @param dist 目标
 * @param damping 减速比例
 * @returns 当前值
 */
export function damp(value: number, dist: number, damping = 0.1) {
    const diff = dist - value;

    if (0.1 < Math.abs(diff)) {
        // console.log( (dist - (((1 - damping) * diff)))|0);
        // return (dist - (((1 - damping) * diff)));
        return dist - (((1 - damping) * diff) | 0);
    }
    return dist;
}

// console.warn(damp(-0, -1002));
// console.warn(damp(-101, -1002));

// console.warn(damp(-192, -2000));

// const [run,stop] = tween([0, 0],[-100,-100], 10000);
//  run(console.log)
