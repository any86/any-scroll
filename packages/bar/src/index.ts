import { setStyle, setTranslate } from '@any-scroll/shared';
import { insertCss } from 'insert-css';
import AnyTouch from 'any-touch'
import { TRACK_CLASS_NAME, THUMB_CLASS_NAME, BAR_CSS, DIRECTION } from './const';
import clamp from 'lodash/clamp';
/**
 * 创建滚动条
 * @param el 容器元素
 * @returns 
 */
export default function (el: HTMLElement, onChange: (x: number, y: number, width: number, height: number) => void) {
    let __barX = 0;
    let __barY = 0;
    insertCss(BAR_CSS);
    const [trackElX, thumbElX] = __createScrollBar(el, DIRECTION.X, __barX);
    const [trackElY, thumbElY] = __createScrollBar(el, DIRECTION.Y, __barY);
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
                __barX += deltaX;
                setTranslate(thumbEl, __barX, 0);
            } else {
                __barY += deltaY;
                setTranslate(thumbEl, 0, __barY);
            }
            onChange(__barX, __barY, thumbWidth, thumbHeight);
        });

        return [trackEl, thumbEl];
    }

    function updateBarX([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]) {
        let scale = 1;
        thumbWidth = Math.abs(width / minX * width);
        if (0 < x) {
            scale = 1 - (x / width);
        } else if (minX > x) {
            scale = 1 - (minX - x) / width
        }
        thumbWidth *= scale

        setStyle(thumbElX, { width: `${thumbWidth}px` });
        __barX = clamp(x / (minX) * (width - thumbWidth), 0, width - thumbWidth);
        setTranslate(thumbElX, __barX, 0);
        return thumbWidth;
    }

    function updateBarY([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]) {
        let scale = 1;
        thumbHeight = Math.abs(height / minY * height);
        if (0 < y) {
            scale = 1 - (y / height);
        } else if (minY > y) {
            scale = 1 - (minY - y) / height
        }
        thumbHeight *= scale
        setStyle(thumbElY, { height: `${thumbHeight}px` });
        __barY = clamp(y / minY * (height - thumbHeight), 0, height - thumbHeight);
        setTranslate(thumbElY, 0, __barY);
        return thumbHeight;
    }

    function updateBar([x, y]: [number, number], [width, height, minX, minY]: [number, number, number, number]) {
        updateBarX([x, y], [width, height, minX, minY]);
        updateBarY([x, y], [width, height, minX, minY]);
    }

    return updateBar;
}