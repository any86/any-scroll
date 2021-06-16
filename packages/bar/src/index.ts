import { setStyle, setTranslate, createDOMDiv, hideDOM } from '@any-scroll/shared';
import { insertCss } from 'insert-css';
import AnyTouch from 'any-scroll'
import { TRACK_CLASS_NAME, THUMB_CLASS_NAME, BAR_CSS, DIRECTION } from './const';
import clamp from 'lodash/clamp';

const sizeProps = ['width', 'height'];
/**
 * 创建滚动条
 * @param el 容器元素
 * @returns 
 */
export default function (el: HTMLElement) {
    insertCss(BAR_CSS);
    const barElementsXY = [DIRECTION.X, DIRECTION.Y].map(dir => {
        return __createDOM(el, dir);
    });

    /**
     * 创建指定轴的滚动条DOM
     * @param el view元素
     * @param axis 轴
     * @returns [滚动条轨道,把手]
     */
    function __createDOM(el: HTMLElement, axis: 'x' | 'y' = DIRECTION.X) {
        const trackEl = createDOMDiv();
        const thumbEl = createDOMDiv();
        trackEl.className = `${TRACK_CLASS_NAME} ${TRACK_CLASS_NAME}-${axis}`;
        thumbEl.className = `${THUMB_CLASS_NAME} ${THUMB_CLASS_NAME}-${axis}`;
        trackEl.appendChild(thumbEl);
        el.appendChild(trackEl);


        // const at = new AnyTouch(thumbEl);
        // at.on('panmove', ({ deltaX, deltaY }) => {
        //     if (DIRECTION.X === axis) {
        //         newValue += deltaX;
        //         setTranslate(thumbEl, newValue, 0);
        //     } else {
        //         __barY += deltaY;
        //         setTranslate(thumbEl, 0, __barY);
        //     }
        //     onChange(newValue, __barY, thumbWidth, thumbHeight);
        // });

        return [trackEl, thumbEl];
    }


    /**
     * 计算滚动条把手的尺寸和位置
     * @param position view的位置
     * @param trackLength view的外框尺寸
     * @param minValue view的最小位置
     * @returns 把手的尺寸和位置
     */
    function __calcBar(position: number, trackLength: number, minValue: number): [number, number] {
        let scale = 1;
        let thumbLength = Math.abs(trackLength / (minValue - trackLength) * trackLength);
        if (0 < position) {
            scale = 1 - (position / trackLength);
        } else if (minValue > position) {
            scale = 1 - (minValue - position) / trackLength
        }
        thumbLength *= scale
        const newPosition = clamp(position / (minValue) * (trackLength - thumbLength), 0, trackLength - thumbLength);
        return [thumbLength, newPosition];
    }

    /**
     * 根据view的数据调整bar
     * @param position view的xy
     * @param warpSize view的外壳尺寸
     * @param min view可以到达的最小xy
     * @param contentSize 内容尺寸
     */
    function updateBar(position: [number, number], warpSize: [number, number], min: [number, number], contentSize: [number, number]) {
        for (let i = 0; i < 2; i++) {
            if (contentSize[i] > warpSize[i]) {
                const [thumbLength, newPosition] = __calcBar(position[i], warpSize[i], min[i]);
                const __thumbEl = barElementsXY[i][1];
                const positionMaybe = [newPosition, 0];
                setStyle(__thumbEl, { [sizeProps[i]]: `${thumbLength}px` });
                setTranslate(__thumbEl, positionMaybe[i], positionMaybe[1 ^ i]);
            } else {
                hideDOM(barElementsXY[i][0]);
            }
        }
    }

    return updateBar;
}