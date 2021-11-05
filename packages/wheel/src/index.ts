import { Wrap } from '@any-scroll/core';
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
    const unWatch = watchWheel(el, ({ type, deltaX, deltaY, vx, vy, target }) => {
        wrapRef.currentContentRef = wrapRef.findContentRef(target as HTMLElement);
        if (null === wrapRef.currentContentRef) return;

        const isWheelX = allow[0] && (!allow[1] || deltaX);
        const deltaXOrY = deltaY || deltaX;
        const vXorY = vy || vx;

        const { xy } = wrapRef.currentContentRef;
        wrapRef.targets = [target];

        if ('start' === type) {
            wrapRef.currentContentRef.stop();
        }
        if ('move' === type || 'start' === type) {
            const nextXY: [number, number] = isWheelX ? [xy[0] - deltaXOrY, xy[1]] : [xy[0], xy[1] - deltaXOrY];
            wrapRef.dampScroll(nextXY);
        } else if ('end' === type) {
            const nextXY: [number, number] = isWheelX ? [xy[0] - vXorY * 5, xy[1]] : [xy[0], xy[1] - Math.ceil(vXorY) * 30];
            wrapRef.dampScroll(nextXY);
        }
    });

    wrapRef.on('beforeDestroy',unWatch);
}
