import raf from 'raf';
export function setStyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    for (const key in styles) {
        el.style.setProperty(key, styles[key] as string);
    }
}

export function setTranslate(el: HTMLElement, x: number, y: number) {
    setStyle(el, { transform: `translate3d(${x}px, ${y}px,0)` });
}

export function appendStyleToHTML(style: string) {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    if (document.head) {
        document.head.appendChild(styleEl);
    }
}

export function createDOMDiv() {
    return document.createElement(`div`);
}

export function hideDOM(el: HTMLElement) {
    setStyle(el, { display: 'none' });
}


export function easing(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

/**
* 运行2次
* @param callback 每次运行传入索引
*/
export function runTwice(callback: (n: number) => unknown) {
    return [callback(0), callback(1)];
}

/**
 * 缓动变化
 * 
 * @param to 目标值, 起始值为[0] 
 * @param duration 时间间隔
 * @returns [run, stop] 开始和停止函数
 * @example
 * const [run,stop] = tween([10, 30],[100,300], 1000); 
 * run(console.log)
 */
export function tween<T extends number[]>(from: T, to: T, duration: number) {
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
            const valueProgress = easing(timeProgress);
            if (1 > timeProgress) {
                const currentValue = _from.map((n, i) => n + valueDiff[i] * valueProgress);
                onChange(currentValue as T)
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

console.warn(damp(-0, -1002));
console.warn(damp(-101, -1002));

console.warn(damp(-192, -2000));


// const [run,stop] = tween([0, 0],[-100,-100], 10000);
//  run(console.log)