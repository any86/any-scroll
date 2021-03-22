import { setStyle, setTranslate } from '@any-scroll/shared';
import { insertCss } from 'insert-css';


const BAR_CSS = `
.any-scroll {
    display: block;
    position: relative;
}

.any-scroll > .scroll-bar-track{
    position:absolute;
    right:0;
    bottom:0;
    background: #ddd;
}

.any-scroll >.scroll-bar-track > .scroll-bar-thumb{
    width: 8px;
    height: 8px;
    background: #aaa;
    border-radius:4px;
}

.any-scroll > .scroll-bar-track-x{
    left:0;
    height:10px;
}

.any-scroll > .scroll-bar-track-y{
    top:0;
    width:10px;
}
`;


/**
 * 创建滚动条
 * @param el 容器元素
 * @returns 
 */
export default function (el: HTMLElement) {
    insertCss(BAR_CSS);
    const [trackElX, thumbElX] = createScrollBar(el);

    function updateX([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]) {
        const thumbWidth = Math.abs(width / minX * width);
        setStyle(thumbElX, { width: `${thumbWidth}px` });
        setTranslate(thumbElX, x / (minX) * (width - thumbWidth), 0);
    }

    const [trackElY, thumbElY] = createScrollBar(el, 'y');

    function updateY([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]) {
        const thumbHeight = Math.abs(height / minY * height);
        setStyle(thumbElY, { height: `${thumbHeight}px` });
        setTranslate(thumbElY, 0, y / minY * (height - thumbHeight));
    }

    function update([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]){
        updateX([x,y],[width, height, minX, minY]);
        updateY([x,y],[width, height, minX, minY]);
    }

    return update;
}



const TRACK_CLASS_NAME = 'scroll-bar-track';
const THUMB_CLASS_NAME = 'scroll-bar-thumb';


function createScrollBar(el: HTMLElement, axis: 'x' | 'y' = 'x') {
    const trackEl = document.createElement('div');
    const thumbEl = document.createElement('div');
    trackEl.className = `${TRACK_CLASS_NAME} scroll-bar-track-${axis}`;
    thumbEl.className = `${THUMB_CLASS_NAME} ${THUMB_CLASS_NAME}-${axis}`;
    trackEl.appendChild(thumbEl);
    el.appendChild(trackEl);
    return [trackEl, thumbEl];
}

