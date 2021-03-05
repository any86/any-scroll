import AnyTouch from '@any-touch/Core'

export default function (el: HTMLElement, options = {}) {
    const STYLE: Partial<CSSStyleDeclaration> = {
        width: '100%'
    };

    for (const key in STYLE) {
        el.style.setProperty(key, STYLE[key] as string);
    }
    const contentEL = document.createElement('div');
    console.log(el.firstChild);

    while(el.firstChild){
        contentEL.appendChild(el.firstChild);
    }
    el.appendChild(contentEL);
}
