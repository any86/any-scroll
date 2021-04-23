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

export function hideDOM(el:HTMLElement){
    setStyle(el,{display:'none'});
}

/**
 * 封装settimeout
 * @param callback 
 * @param duration 默认延迟96ms
 */
export function delay(callback: () => void, duration = 96) {
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
export function nextTick(total: number, each: (n: number, rafId: number) => void, damping: number, startValue = 0) {
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

export function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}