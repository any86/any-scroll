import { setStyle, setTranslate } from '@any-scroll/shared';
import { insertCss } from 'insert-css';
import AnyTouch from 'any-touch'
import { TRACK_CLASS_NAME, THUMB_CLASS_NAME, BAR_CSS, DIRECTION } from './const';

/**
 * 创建滚动条
 * @param el 容器元素
 * @returns 
 */
export default function (el: HTMLElement, onChange: (x: number, y: number, width: number, height: number) => void) {
    let __x = 0;
    let __y = 0;
    insertCss(BAR_CSS);
    const [trackElX, thumbElX] = __createScrollBar(el, DIRECTION.X, __x);
    const [trackElY, thumbElY] = __createScrollBar(el, DIRECTION.Y, __y);
    let thumbWidth = 0;
    let thumbHeight = 0;


    function __createScrollBar(el: HTMLElement, axis: 'x' | 'y' = DIRECTION.X, value = 0) {
        const trackEl = document.createElement('div');
        const thumbEl = document.createElement('div');
        trackEl.className = `${TRACK_CLASS_NAME} ${TRACK_CLASS_NAME}-${axis}`;
        thumbEl.className = `${THUMB_CLASS_NAME} ${THUMB_CLASS_NAME}-${axis}`;
        trackEl.appendChild(thumbEl);
        el.appendChild(trackEl);


        const at = new AnyTouch(thumbEl);
        at.on('panmove', ({ deltaX, deltaY }) => {
            if (DIRECTION.X === axis) {
                __x += deltaX;
                setTranslate(thumbEl, __x, 0);
            } else {
                __y += deltaY;
                setTranslate(thumbEl, 0, __y);
            }
            onChange(__x, __y, thumbWidth, thumbHeight);
        });

        return [trackEl, thumbEl];
    }

    function updateX([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]) {
        thumbWidth = Math.abs(width / minX * width);
        setStyle(thumbElX, { width: `${thumbWidth}px` });
        __x = x / (minX) * (width - thumbWidth);
        setTranslate(thumbElX, __x, 0);
        return thumbWidth;
    }

    function updateY([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]) {
        thumbHeight = Math.abs(height / minY * height);
        setStyle(thumbElY, { height: `${thumbHeight}px` });
        __y = y / minY * (height - thumbHeight);
        setTranslate(thumbElY, 0, __y);
        return thumbHeight;
    }

    function updateBar([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]) {
        updateX([x, y], [width, height, minX, minY]);
        updateY([x, y], [width, height, minX, minY]);
    }

    return updateBar;
}