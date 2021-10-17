// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/wheel_event
const { setTimeout } = window;
const WHEEL = 'wheel';

// 参考
// https://github.com/pmndrs/use-gesture/blob/3290c1d5f6beea238afb82c55d48855f10780874/packages/core/src/utils/events.ts#L83
const LINE_HEIGHT = 40
const PAGE_HEIGHT = 800
function normalizeWheel(e: WheelEvent) {
    let { deltaX, deltaY, deltaMode } = e;
    // console.log(deltaMode, e.DOM_DELTA_LINE);
    if (deltaMode == e.DOM_DELTA_LINE) {
        deltaX *= LINE_HEIGHT
        deltaY *= LINE_HEIGHT
    } else if (deltaMode == e.DOM_DELTA_PAGE) {
        deltaX *= PAGE_HEIGHT
        deltaY *= PAGE_HEIGHT
    }
    return [deltaX, deltaY];
}

export default function (el: HTMLElement, onChange: (e: any) => void) {
    let lastWheelTime: number | undefined;
    let endTimerId: number;
    let deltaYCounter = 0;
    let deltaXCounter = 0;

    function __onWheel(e: WheelEvent) {
        let [deltaX, deltaY] = normalizeWheel(e);
        deltaXCounter += deltaX;
        deltaYCounter += deltaY;


        // 最后一下滚动
        clearTimeout(endTimerId);
        endTimerId = setTimeout(() => {
            const timeDiff = Date.now() - <number>lastWheelTime;
            const vx = deltaXCounter / timeDiff;
            const vy = deltaYCounter / timeDiff;

            lastWheelTime = void 0;
            deltaXCounter = 0;
            deltaYCounter = 0;
            el.dispatchEvent(new Event('wheelend', {}));
            onChange({ target: e.target, type: 'end', deltaX, deltaY, vx, vy });
        }, 16);


        // 开始
        if (void 0 === lastWheelTime) {
            onChange({ target: e.target, type: 'start', deltaX, deltaY });
            el.dispatchEvent(new Event('wheelstart', {}));
        }
        // 移动
        else {
            el.dispatchEvent(new Event('wheelmove', {}));
            onChange({ target: e.target, type: 'move', deltaX, deltaY });
        }

        lastWheelTime = Date.now();
        // e.preventDefault();
    }
    el.addEventListener(WHEEL, __onWheel);


    return () => {
        el.removeEventListener(WHEEL, __onWheel);
    }
}