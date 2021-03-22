export function setStyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
    for (const key in styles) {
        el.style.setProperty(key, styles[key] as string);
    }
}

export function setTranslate(el:HTMLElement,x:number,y:number){
    setStyle(el,{transform:`translate3d(${x}px, ${y}px,0)`});
}

export function appendStyleToHTML(style: string) {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    if (document.head) {
        document.head.appendChild(styleEl);
    }
}