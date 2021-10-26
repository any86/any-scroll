import { setStyle, setTranslate, createDOMDiv, hideDOM, runTwice } from '@any-scroll/shared';
import { insertCss } from 'insert-css';
import { TRACK_CLASS_NAME, THUMB_CLASS_NAME, BAR_CSS, DIRECTION } from './const';
import clamp from 'lodash/clamp';
import { Wrap, Content } from '@any-scroll/core';
const widthAndHeight = ['width', 'height'];
type WarpInstance = InstanceType<typeof Wrap>;
type ContentInstance = InstanceType<typeof Content>;
/**
 * 创建滚动条
 * @param el 容器元素
 * @returns
 */
export default function (context: WarpInstance) {
    let __isDraggingBar = false;
    insertCss(BAR_CSS);
    const bars: WarpInstance[] = [];
    // 构建x|y轴滚动条DOM
    const xyBarElements = [DIRECTION.X, DIRECTION.Y].map((dir, index) => {
        const [trackEl, thumbEl] = createDOM(context.el as HTMLElement, dir);
        // console.log(trackEl.clientHeight);
        // 基于scroll做bar
        const bar = new Wrap(trackEl, { allow: [DIRECTION.X === dir, DIRECTION.Y === dir], overflowDistance: 0 });
        bars.push(bar);
        setStyle(bar.el as HTMLElement, { position: 'absolute' });
        bar.on('pan', (e) => {
            const thumb = bar.getContentRef();
            if (thumb) {
                const contentRef = context.getContentRef();
                if (null !== contentRef) {
                    // 缩放, bar => scrollView
                    const { xy } = contentRef;
                    const nextXY = [...xy] as [number, number];
                    nextXY[index] = -thumb.xy[index] * contentRef.contentSize[index] / thumb.wrapSize[index];
                    contentRef.moveTo(nextXY);
                    __isDraggingBar = true;
                }
            }
        });

        bar.on('at:end', () => {
            __isDraggingBar = false;
        })
        return [trackEl, thumbEl];
    });

    updateBar(context, bars, xyBarElements);
    context.on(['at:start', 'scroll'], () => {
        if (__isDraggingBar) return;
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
        const { contentSize, wrapSize, minXY, maxXY } = contentRef;
        runTwice((i) => {
            if (contentSize[i] > wrapSize[i]) {
                const thumbRef = bars[i].getContentRef();
                if (null !== thumbRef) {
                    const [thumbSize, thumbXorY] = calcBarXorY(
                        contentRef.xy[i],
                        wrapSize[i],
                        contentSize[i],
                        maxXY[i],
                        minXY[i],
                        thumbRef.minXY[i],
                        thumbRef.maxXY[i]
                    );
                    const thumbElement = xyBarElements[i][1];
                    setStyle(thumbElement, { [widthAndHeight[i]]: `${thumbSize}px` });

                    // 设置thumb的滑动范围
                    thumbRef.maxXY[i] = thumbRef.wrapSize[i] - thumbSize;
                    thumbRef.minXY[i] = 0;

                    // 移动thumb
                    const { xy } = thumbRef;
                    xy[i] = thumbXorY;
                    thumbRef.moveTo(xy);
                }
            } else {
                hideDOM(xyBarElements[i][0]);
            }
        });
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
 * @param scrollViewXOrY scrollView当前的X|Y值
 * @param trackLength scrollView的外框尺寸做滚动轨道尺寸
 * @param maxXorY scrollView的xy的最大值
 * @param maxXorY scrollView的xy的最小值
 * @returns 把手的尺寸和位置
 */
function calcBarXorY(
    scrollViewXOrY: number,
    wrapSize: number,
    contentSize: number,
    maxXorY: number,
    minXorY: number,
    thumbMinXOrY: number,
    thumbMaxXOrY: number
): [number, number] {
    const trackSize = wrapSize;
    const scrollViewMaxDistance = maxXorY - minXorY;
    let scale = 1;
    let thumbLength = (wrapSize / contentSize) * trackSize;

    // 如果超出边界要thumb要缩短
    if (minXorY >= scrollViewXOrY) {
        scale = 1 - (minXorY - scrollViewXOrY) / wrapSize;
    } else if (maxXorY < scrollViewXOrY) {
        scale = 1 - (scrollViewXOrY - maxXorY) / wrapSize;
    }
    thumbLength *= scale;

    // 缩放, scrollView => bar
    // const thumbXorY = clamp(
    //     -((scrollViewXOrY / scrollViewMaxDistance) * (trackSize - thumbLength)),
    //     thumbMinXOrY,
    //     thumbMaxXOrY
    // );

    const thumbXorY = -((scrollViewXOrY / scrollViewMaxDistance) * (trackSize - thumbLength));
    return [thumbLength, thumbXorY];
}
