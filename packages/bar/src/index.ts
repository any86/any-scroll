import { setStyle } from '@any-scroll/shared';
import insertCss from 'insert-css';


const BAR_CSS = `
.any-scroll {
    display: block;
    position: relative;
}

.any-scroll > .scroll-bar-track{
    position:absolute;
    right:0;
    top:0;
    bottom:0;
    width:10px;
    background: #ddd;
}

.any-scroll >.scroll-bar-track > .scroll-bar-thumb{
    width: 8px;
    height: 8px;
    background: #aaa;
    border-radius:4px;
}
`;


export default function (el: HTMLElement) {
    const trackEl = document.createElement('div');
    const thumbEl = document.createElement('div');
    trackEl.className = 'scroll-bar-track';
    thumbEl.className = 'scroll-bar-thumb';
    trackEl.appendChild(thumbEl);
    el.appendChild(trackEl);
    // trackEl
    insertCss(BAR_CSS);

    function update([x, y]: [number, number],[minX,minY]: [number, number]) {
        thumbEl.style.setProperty('transform', `translate3d(${0}px, ${y/minY*100}px, 0)`);
        console.log(x, y,minX,minY);
    }


    return [update];
}

