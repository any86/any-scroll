import { setStyle, createDOMDiv, changeDOMVisible, changeOpacity, runTwice, DIRECTION } from '@any-scroll/shared';
import { insertCss } from 'insert-css';
import { TRACK_CLASS_NAME, THUMB_CLASS_NAME, BAR_CSS } from './const';
import { Wrap, Content } from '@any-scroll/core';
const { setTimeout } = window;
type WarpInstance = InstanceType<typeof Wrap>;
type ContentInstance = InstanceType<typeof Content>;

/**
 * 创建滚动条
 * @param el 容器元素
 * @returns
 */
export default function (wrapRef: WarpInstance) {
    const { allow } = wrapRef.options;
    // 给updateBar函数用
    let timeoutIds = [-1, -1];
    let __isDraggingBar = false;
    insertCss(BAR_CSS);
    // 构建x|y轴滚动条DOM
    const barRefs = runTwice(createBar);

    wrapRef.on(['at:start', 'scroll', 'resize'], () => {
        // if (__isDraggingBar) return;
        updateBar(wrapRef, barRefs, allow);
    });

    wrapRef.on('change-content', (ref) => {
        // console.log(ref);
        updateBar(wrapRef, barRefs, allow);
    });

    wrapRef.on('beforeDestroy', () => {
        barRefs.forEach((barRef) => {
            barRef.destroy();
            barRef.el.parentElement?.removeChild(barRef.el);
        });
    });

    /**
     * 生成bar
     * @param index 0:x轴, 1:y轴
     * @returns bar的track和thumb元素
     */
    function createBar(index: number) {
        const dir = [DIRECTION.X, DIRECTION.Y][index];
        const trackEl = createDOM(wrapRef.el as HTMLElement, dir);
        // console.log(trackEl.clientHeight);

        // ⭐基于scroll做bar
        const bar = new Wrap(trackEl, { allow: [DIRECTION.X === dir, DIRECTION.Y === dir], overflowDistance: 0 });
        setStyle(bar.el as HTMLElement, { position: 'absolute', display: 'none' });
        bar.at.on('pan', () => {
            __isDraggingBar = true;
            const thumb = bar.getContentRef() as ContentInstance;
            const contentRef = wrapRef.getContentRef();
            if (null !== contentRef) {
                // 缩放, bar => scrollView
                const { xy } = contentRef;
                const nextXY = [...xy] as [number, number];
                nextXY[index] = (-thumb.xy[index] * contentRef.contentSize[index]) / thumb.wrapSize[index];
                contentRef.moveTo(nextXY);
            }
        });

        // bar.on('tap', e => {
        //     if (e.target === bar.el) {
        //         const {height,y} = bar.el.getBoundingClientRect();
        //         bar.getContentRef()?.scrollTo([0, e.y - y]);
        //     }
        // })

        bar.at.on('at:end', () => {
            __isDraggingBar = false;
        });
        return bar;
    }

    /**
     * 根据view的数据调整bar
     * @param position view的xy
     * @param warpSize view的外壳尺寸
     * @param min view可以到达的最小xy
     * @param contentSize 内容尺寸
     */
    function updateBar(wrapRef: WarpInstance, barRefs: WarpInstance[], allow: [boolean, boolean]) {
        const contentRef = wrapRef.getContentRef() as ContentInstance;
        const { contentSize, wrapSize, minXY, maxXY } = contentRef;
        runTwice((i) => {
            const barRef = barRefs[i];
            const trackElement = barRef.el;

            if (allow[i]) {
                changeDOMVisible(trackElement);
            } else {
                return;
            }

            if (contentSize[i] > wrapSize[i]) {
                changeOpacity(trackElement, 1);
                clearTimeout(timeoutIds[i]);
                timeoutIds[i] = setTimeout(() => {
                    changeOpacity(trackElement, 0);
                }, 1000);

                const thumbRef = barRefs[i].getContentRef();
                if (null !== thumbRef) {
                    // 计算尺寸和位置
                    const [thumbSize, thumbXorY] = calcBarXorY(
                        contentRef.xy[i],
                        wrapSize[i],
                        contentSize[i],
                        maxXY[i],
                        minXY[i],
                        thumbRef.minXY[i],
                        thumbRef.maxXY[i]
                    );
                    const thumbElement = barRef.getContentRef()!.el;
                    setStyle(thumbElement, { [['width', 'height'][i]]: `${thumbSize}px` });

                    // 设置thumb的滑动范围
                    thumbRef.maxXY[i] = thumbRef.wrapSize[i] - thumbSize;
                    thumbRef.minXY[i] = 0;

                    // 移动thumb
                    const { xy } = thumbRef;
                    xy[i] = thumbXorY;
                    thumbRef.moveTo(xy);
                }
            } else {
                changeDOMVisible(trackElement, false);
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
    return trackEl;
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
