// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/wheel_event
const { setTimeout } = window;
const WHEEL = 'wheel';

/**
 * 统一滚轮的表现
 * 参考: https://github.com/pmndrs/use-gesture/blob/3290c1d5f6beea238afb82c55d48855f10780874/packages/core/src/utils/events.ts#L83
 * @param e 鼠标滚轮事件对象
 * @param LINE_HEIGHT 滚动一行的高度
 * @param PAGE_HEIGHT 滚动一页的高度
 * @returns 一次滚动的偏移
 */
function normalizeWheel(e: WheelEvent, LINE_HEIGHT = 40, PAGE_HEIGHT = 800) {
    let { deltaX, deltaY, deltaMode } = e;
    // console.log(deltaMode, e.DOM_DELTA_LINE);
    if (deltaMode == e.DOM_DELTA_LINE) {
        deltaX *= LINE_HEIGHT;
        deltaY *= LINE_HEIGHT;
    } else if (deltaMode == e.DOM_DELTA_PAGE) {
        deltaX *= PAGE_HEIGHT;
        deltaY *= PAGE_HEIGHT;
    }
    return [deltaX, deltaY];
}
interface WheelEvent2 {
    target:EventTarget|null;
    type: 'start' | 'move' | 'end';
    [k: string]: any;
}
export default function (el: HTMLElement, onChange: (e: WheelEvent2) => void) {
    // 上一次滚动发生时间
    let _lastWheelTime: number | undefined;
    // wheelend延迟触发的id
    let _endTimeoutId: number;
    // 一轮滚动距离的和
    let _deltaYCounter = 0;
    let _deltaXCounter = 0;

    function __onWheel(e: WheelEvent) {
        const [deltaX, deltaY] = normalizeWheel(e);
        _deltaXCounter += deltaX;
        _deltaYCounter += deltaY;
        /**
         * 触发回调和自定义DOM事件
         * @param e 滚轮事件
         * @param type 类型: 'start' | 'move' | 'end'
         * @param payload 自定义事件数据
         */
        function _dispatchEvent(type: 'start' | 'move' | 'end', payload?: Record<string, any>) {
            const wheelEvent2 = {
                target:e.target,
                deltaX,
                deltaY,
                type,
                ...payload,
            };

            const event = new Event('wheel' + type);
            onChange(wheelEvent2);
            el.dispatchEvent(event);
        }

        // 最后一下滚动
        clearTimeout(_endTimeoutId);
        _endTimeoutId = setTimeout(() => {
            const timeDiff = Date.now() - <number>_lastWheelTime;
            const vx = _deltaXCounter / timeDiff;
            const vy = _deltaYCounter / timeDiff;

            _lastWheelTime = void 0;
            _deltaXCounter = 0;
            _deltaYCounter = 0;
            _dispatchEvent('end', { vx, vy });
        }, 16);

        // 开始
        if (void 0 === _lastWheelTime) {
            _dispatchEvent('start');
        }
        // 移动
        else {
            _dispatchEvent('move');
        }
        _lastWheelTime = Date.now();
    }

    el.addEventListener(WHEEL, __onWheel);
    return () => {
        el.removeEventListener(WHEEL, __onWheel);
    };
}
