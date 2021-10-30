import { setStyle, createDOMDiv, changeDOMVisible, runTwice, DIRECTION } from '@any-scroll/shared';
import { insertCss } from 'insert-css';
import { TRACK_CLASS_NAME, THUMB_CLASS_NAME, BAR_CSS, } from './const';
import { Wrap } from '@any-scroll/core';
type WarpInstance = InstanceType<typeof Wrap>;
/**
 * 创建滚动条
 * @param el 容器元素
 * @returns
 */
export default function (wrapRef: WarpInstance) {
    let __isDraggingBar = false;
    insertCss(BAR_CSS);
    const barRefs: WarpInstance[] = [];
    // 构建x|y轴滚动条DOM
    const xyBarElements = [DIRECTION.X, DIRECTION.Y].map((dir, index) => {
        const [trackEl, thumbEl] = createDOM(wrapRef.el as HTMLElement, dir);

        // ⭐基于scroll做bar
        const barRef = new Wrap(trackEl, {
            allow: [DIRECTION.X === dir, DIRECTION.Y === dir],
            overflowDistance: 0,
            watchResize: false,
        });

        barRefs.push(barRef);
        setStyle(barRef.el as HTMLElement, { position: 'absolute' });

        barRef.on('pan', () => {
            const thumbRef = barRef.getContentRef();
            if (thumbRef) {
                const contentRef = wrapRef.getContentRef();
                if (null !== contentRef) {
                    // 缩放, bar => scrollView
                    const { xy } = contentRef;
                    console.log(xy);
                    const nextXY = [...xy] as [number, number];
                    nextXY[index] = (-thumbRef.xy[index] * contentRef.contentSize[index]) / thumbRef.wrapSize[index];
                    contentRef.moveTo(nextXY);
                    __isDraggingBar = true;
                }
            }
        });

        barRef.on('at:end', () => {
            __isDraggingBar = false;
        });
        return [trackEl, thumbEl];
    });

    updateBar(wrapRef, barRefs, xyBarElements);
    wrapRef.on(['at:start', 'scroll', 'resize'], () => {
        if (__isDraggingBar) return;
        updateBar(wrapRef, barRefs, xyBarElements);
    });
}

/**
 * 根据view的数据调整bar
 * @param position view的xy
 * @param warpSize view的外壳尺寸
 * @param min view可以到达的最小xy
 * @param contentSize 内容尺寸
 */
function updateBar(wrapRef: WarpInstance, barRefs: WarpInstance[], xyBarElements: HTMLElement[][]) {
    const contentRef = wrapRef.getContentRef();
    if (null !== contentRef) {
        const { contentSize, wrapSize, minXY, maxXY, xy } = contentRef;
        // console.log(JSON.stringify({ contentSize, wrapSize, minXY, maxXY }));
        runTwice((i) => {
            if (contentSize[i] > wrapSize[i]) {
                changeDOMVisible(xyBarElements[i][0]);
                const thumbRef = barRefs[i].getContentRef();
                if (null !== thumbRef) {
                    const [thumbSize, thumbXorY] = getBarSizeAndPosition(
                        contentRef.xy[i],
                        wrapSize[i],
                        contentSize[i],
                        maxXY[i],
                        minXY[i],
                        thumbRef.minXY[i],
                        thumbRef.maxXY[i]
                    );
                    const thumbElement = xyBarElements[i][1];
                    setStyle(thumbElement, { [['width', 'height'][i]]: `${thumbSize}px` });

                    // 设置thumb的滑动范围
                    // 此处不能直接取thumbRef的warpSize和contentSize
                    // 值不对, 原因稍后调查
                    thumbRef.maxXY[i] = contentRef.wrapSize[i] - thumbSize;
                    thumbRef.minXY[i] = 0;

                    // 移动thumb
                    const { xy } = thumbRef;
                    xy[i] = thumbXorY;
                    thumbRef.moveTo(xy);
                }
            } else {
                changeDOMVisible(xyBarElements[i][0], false);
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
function getBarSizeAndPosition(
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
