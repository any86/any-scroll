import { setStyle, setTranslate, createDOMDiv, hideDOM, runTwice } from '@any-scroll/shared';
import { insertCss } from 'insert-css';
import { TRACK_CLASS_NAME, THUMB_CLASS_NAME, BAR_CSS, DIRECTION } from './const';
import clamp from 'lodash/clamp';
import { Wrap } from '@any-scroll/core';
const widthAndHeight = ['width', 'height'];
type WarpInstance = InstanceType<typeof Wrap>
/**
 * 创建滚动条
 * @param el 容器元素
 * @returns 
 */
export default function (context: WarpInstance) {
    insertCss(BAR_CSS);
    const bars: WarpInstance[] = [];
    // 构建x|y轴滚动条DOM
    const xyBarElements = [DIRECTION.X, DIRECTION.Y].map(dir => {
        const [trackEl, thumbEl] = createDOM(context.el as HTMLElement, dir);
        // console.log(trackEl.clientHeight);
        // 基于scroll做bar
        const bar = new Wrap(trackEl, { allow: [DIRECTION.X === dir, DIRECTION.Y === dir], overflowDistance: 0 });
        // console.log(trackEl.clientHeight);
        bars.push(bar);
        setStyle(bar.el as HTMLElement, { position: 'absolute' });


        bar.on('pan', e => {
            console.log(bar.getContentRef()?.xy);
        })
        return [trackEl, thumbEl];
    });



    updateBar(context, bars, xyBarElements);
    context.on(['at:start', 'scroll'], () => {
        updateBar(context, bars, xyBarElements);
    });
}



/**
 * 根据view的数据调整bar
 * @param position view的xy
 * @param warpSize view的外壳尺寸
 * @param min view可以到达的最小xy
 * @param contentSize 内容尺寸
 */
function updateBar(context: WarpInstance, bars: WarpInstance[], xyBarElements: HTMLElement[][]) {
    const contentRef = context.getContentRef();
    if (null !== contentRef) {
        const { contentSize, wrapSize, minXY } = contentRef;

        runTwice(i => {
            if (contentSize[i] > wrapSize[i]) {
                const [thumbLength, newPosition] = calcBar(contentRef.xy[i], wrapSize[i], minXY[i]);
                const thumbElement = xyBarElements[i][1];
                setStyle(thumbElement, { [widthAndHeight[i]]: `${thumbLength}px` });
                const thumbRef = bars[i].getContentRef();
                if (null !== thumbRef) {
                    // 设置thumb的滑动范围
                    // console.log(i,thumbRef,thumbRef.wrapSize[i], thumbRef.contentSize[i]);
                    thumbRef.maxXY[i] = thumbRef.wrapSize[i] - thumbRef.contentSize[i];
                    const { xy } = thumbRef;
                    xy[i] = newPosition;
                    thumbRef.moveTo(xy);
                }
            } else {
                hideDOM(xyBarElements[i][0]);
            }
        })
    }
}


/**
 * 创建指定轴的滚动条DOM
 * @param el view元素
 * @param axis 轴
 * @returns [滚动条轨道,把手]
 */
function createDOM(el: HTMLElement, axis: 'x' | 'y' = DIRECTION.X) {
    const trackEl = createDOMDiv([TRACK_CLASS_NAME, `${TRACK_CLASS_NAME}-${axis}`]);
    const thumbEl = createDOMDiv([THUMB_CLASS_NAME, `${THUMB_CLASS_NAME}-${axis}`]);
    trackEl.appendChild(thumbEl);
    el.appendChild(trackEl);
    return [trackEl, thumbEl];
}

/**
 * 计算滚动条把手的尺寸和位置
 * @param position view的位置
 * @param trackLength view的外框尺寸
 * @param minValue view的最小位置
 * @returns 把手的尺寸和位置
 */
function calcBar(position: number, trackLength: number, minValue: number): [number, number] {
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