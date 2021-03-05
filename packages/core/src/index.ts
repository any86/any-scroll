import AnyTouch from 'any-touch'

export default function (el: HTMLElement, options = {}) {
    const STYLE: Partial<CSSStyleDeclaration> = {
        overflow: 'hidden',
    };

    const CONTENT_STYLE: Partial<CSSStyleDeclaration> = {
        width: '100%'
    };

    for (const key in STYLE) {
        el.style.setProperty(key, STYLE[key] as string);
    }

    const contentEL = document.createElement('div');
    while (el.firstChild) {
        contentEL.appendChild(el.firstChild);
    }
    for (const key in CONTENT_STYLE) {
        contentEL.style.setProperty(key, CONTENT_STYLE[key] as string);
    }
    el.appendChild(contentEL);

    const at = new AnyTouch(el);
    let x = 0;
    let y = 0;
    at.on('panmove', e => {
        x += e.deltaX;
        y += e.deltaY;
        scrollTop(contentEL, x, y);
    });

    at.on('swipe', e => {
        if (1 < e.speedX) {
            x += e.speedX * 100;
        }

        if (1 < e.speedY) {
            y += e.speedY * 100;
        }
        scrollTop(contentEL, x, y);
    });
}

function scrollTop(el: HTMLElement, x: number, y: number) {
    el.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`);
}
