import { Wrap } from '@any-scroll/core';
import { TYPE_BEFORE_DESTROY } from 'packages/core/src/const';
import watchWheel from './watchWheel';
type WarpInstance = InstanceType<typeof Wrap>;

/**
 * 创建滚动条
 * @param el 容器元素
 * @returns
 */
export default function (wrapRef: WarpInstance) {
    // 滚动鼠标X轴滑动
    const { allow } = wrapRef.options;
    const { el } = wrapRef;
    const unWatch = watchWheel(el, ({ type, deltaX, deltaY, velocityX, velocityY, target, nativeEvent }) => {
        nativeEvent.preventDefault();
        const currentContentRef = wrapRef.getContentRef(target as HTMLElement);
        if (null === currentContentRef) return;
        wrapRef.active(currentContentRef);
        const isWheelX = allow[0] && (!allow[1] || deltaX);
        const deltaXOrY = deltaY || deltaX;
        const vXorY = velocityY || velocityX;
        const { xy } = currentContentRef;
        wrapRef.targets = [target];

        if ('wheelstart' === type) {
            currentContentRef.stop();
        } else if ('wheelmove' === type) {
            if (9 > Math.abs(vXorY)) {
                const nextXY: [number, number] = isWheelX ? [xy[0] + deltaXOrY, xy[1]] : [xy[0], xy[1] + deltaXOrY];
                wrapRef.dampScroll(nextXY);
            } else {
                const factor = 30;
                const nextXY: [number, number] = isWheelX ? [xy[0] + Math.ceil(vXorY) * factor, xy[1]] : [xy[0], xy[1] + Math.ceil(vXorY) * factor];
                wrapRef.dampScroll(nextXY);
            }
            // console.log({ vXorY });
        }
    });

    wrapRef.on(TYPE_BEFORE_DESTROY, unWatch);
}
