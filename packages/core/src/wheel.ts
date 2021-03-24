// https://developer.mozilla.org/zh-CN/docs/Web/API/Element/wheel_event
const { setTimeout } = window;
const WHEEL = 'wheel';

export default function (el: HTMLElement, onScroll: (e: any) => void) {
    let lastWheelTime: number | undefined;
    let endTimerId: number;
    let deltaYCounter = 0;

    function __onWheel(e: WheelEvent) {
        let { deltaY } = e;
        deltaY *= -1;
        deltaYCounter += deltaY;

        clearTimeout(endTimerId);
        endTimerId = setTimeout(() => {
            const timeDiff = Date.now() - <number>lastWheelTime;
            const v = deltaYCounter / timeDiff;
            lastWheelTime = void 0;
            deltaYCounter = 0;
            el.dispatchEvent(new Event('wheelend', {}));
            onScroll({ type: 'end', v });
        }, 100);


        if (void 0 === lastWheelTime) {
            onScroll('start');
            el.dispatchEvent(new Event('wheelstart', {}));
        } else {
            el.dispatchEvent(new Event('wheelmove', {}));
            onScroll({ type: 'move', deltaY });
        }
        lastWheelTime = Date.now();
        // e.preventDefault();
    }
    el.addEventListener(WHEEL, __onWheel);


    return () => {
        el.removeEventListener(WHEEL, __onWheel);
    }
}