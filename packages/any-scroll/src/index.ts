import Core from '@any-scroll/core'
interface Options { tolerance: number, damping: number, allow: [boolean, boolean] };
export default class {
    constructor(el: HTMLElement,options:Options) {
        return new Core(el,options);
    }
}
