import { setStyle, createDOMDiv, changeDOMVisible, changeOpacity, runTwice, Axis, AxisList } from '@any-scroll/shared';
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
    let __isFoucsInBar = false;
    insertCss(BAR_CSS);
    // 构建x|y轴滚动条DOM
    const barRefs = runTwice(createBar);
    wrapRef.on(['scroll', 'resize'], () => {
        updateBar(wrapRef, barRefs, allow);
    });

    wrapRef.at.on('at:start', () => {
        // 取消bar拖拽的状体
        __isFoucsInBar = false;
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
     * @param axisIndex 0:x轴, 1:y轴
     * @returns bar的track和thumb元素
     */
    function createBar(axisIndex: 0 | 1) {
        const currentAxis = AxisList[axisIndex];
        const trackEl = createDOM(wrapRef.el as HTMLElement, currentAxis);
        // console.log(trackEl.clientHeight);

        // ⭐基于scroll做bar
        const barRef = new Wrap(trackEl, { allow: [Axis.X === currentAxis, Axis.Y === currentAxis], overflowDistance: 0 });
        setStyle(barRef.el as HTMLElement, { position: 'absolute', display: 'none' });

        barRef.at.on('panstart', () => {
            __isFoucsInBar = true;
        });

        barRef.on('scroll', () => {
            // 只响应bar的pan/swipe等产生的滚动
            // 防止bar传给content, content再传给bar这种情况.
            if (!__isFoucsInBar) return;
            const thumbRef = barRef.getContentRef() as ContentInstance;
            const contentRef = wrapRef.getContentRef();
            if (null !== contentRef) {
                // 缩放, bar => scrollView
                const { xy } = contentRef;
                const nextXY = [...xy] as [number, number];
                nextXY[axisIndex] =
                    (-thumbRef.xy[axisIndex] * contentRef.contentSize[axisIndex]) / barRef.size[axisIndex];
                contentRef.moveTo(nextXY);
            }
        });

        /**
         * 点击track空白处,
         * 移动到点击处
         */
        barRef.at.on('tap', (e) => {
            const thumbRef = barRef.getContentRef();
            if (null !== thumbRef && e.target === barRef.el) {
                __isFoucsInBar = true;
                const { x, y } = barRef.el.getBoundingClientRect();
                const { contentSize } = thumbRef;
                const newXY: [number, number] = [0, 0];
                newXY[axisIndex] = [e.x, e.y][axisIndex] - [x, y][axisIndex] - contentSize[axisIndex] / 2;
                thumbRef.dampScroll(newXY);
            }
        });

        return barRef;
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
        const { contentSize, minXY, maxXY } = contentRef;
        const wrapSize = wrapRef.size;
        runTwice((i) => {
            const barRef = barRefs[i];
            const trackElement = barRef.el;

            if (allow[i]) {
                changeDOMVisible(trackElement);
            } else {
                return;
            }
            // console.log(contentSize[i] , wrapSize[i],i);
            // 内容尺寸大于外层尺寸才能显示进度条
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
                    // console.log(i,{thumbSize, thumbXorY});
                    const thumbElement = barRef.getContentRef()!.el;
                    setStyle(thumbElement, { [['width', 'height'][i]]: `${thumbSize}px` });
                    // 更新bar的可滑动范围
                    // 此时的maxXY/minXY还是按照内容尺寸计算的,
                    // 所以不能滑动
                    thumbRef.update();
                    // 设置thumb的滑动范围
                    thumbRef.maxXY[i] = barRef.size[i] - thumbSize;
                    thumbRef.minXY[i] = 0;

                    // 移动thumb
                    const { xy } = thumbRef;
                    // 此处要克隆xy,
                    // 不然moveTo的内部判断xy没有变化,
                    // 是不会执行的,
                    // 触发不了scroll事件
                    const newXY: [number, number] = [...xy];
                    newXY[i] = thumbXorY;
                    thumbRef.moveTo(newXY);
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
function createDOM(el: HTMLElement, axis: 'x' | 'y' = Axis.X) {
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
 * @returns 把手的尺寸(最长边)和位置
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
