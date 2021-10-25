import Core from '@any-scroll/core';
import { Options } from '@any-scroll/core';
import bar from '@any-scroll/bar';

Core.use(bar);
export default class extends Core {
    constructor(el: HTMLElement, options: Options) {
        super(el, options);
    }
}