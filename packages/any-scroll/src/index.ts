import Core from '@any-scroll/core';
import { Options } from '@any-scroll/core';
import bar from '@any-scroll/bar';
import wheel from '@any-scroll/wheel';

Core.use(bar);
Core.use(wheel);
export default class extends Core {
    constructor(el: HTMLElement, options?: Options) {
        super(el, options);
    }
}