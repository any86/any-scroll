import AnyTouch from 'any-touch'
import raf = require('raf')
console.log(raf);

const STYLE: Partial<CSSStyleDeclaration> = {
    overflow: 'hidden',
};
const CONTENT_STYLE: Partial<CSSStyleDeclaration> = {
    width: '100%'
};

export default function (el: HTMLElement, options = {}) {
    // 内容元素当前位移
    let x = 0;
    let y = 0;

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

    // 加载手势
    const at = new AnyTouch(el);
    at.on('panmove', e => {
        x += e.deltaX;
        y += e.deltaY;
        contentEl.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`);
    });

    at.on('swipe', e => {
        let dx = e.speedX * 30;
        let dy = e.speedY * 30;
        _scroll(contentEl, [x, y], [dx, dy], 300, ([distX, distY]) => {
            x = distX;
            y = distY;
        });
    });
}

/**
 * 设置元素的translate
 * @param el 元素
 * @param param1 坐标 
 */
function _setContentTranslate(el: HTMLElement, [x, y]: [number, number]) {
    el.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`);
}

function _scroll(el: HTMLElement, [x, y]: [number, number], [dx, dy]: [number, number], duration: number, done: ([x, y]: [number, number]) => void) {
    let startTime = Date.now();
    function animate() {
        const timeDiff = Date.now() - startTime;
        if (duration > timeDiff) {
            _setContentTranslate(el, [easeOut(timeDiff, x, dx, duration), easeOut(timeDiff, y, dy, duration)]);
            raf(animate);
        } else {
            const dist = [x + dx, y + dy] as [number, number];
            _setContentTranslate(el, dist);
            done && done(dist);
        }
        console.log(el.style.transform, x + dx, y + dy);
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