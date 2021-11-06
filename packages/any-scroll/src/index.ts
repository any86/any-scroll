import Core from '@any-scroll/core';
import { Options, Plugin, PluginOptions } from '@any-scroll/core';
import bar from '@any-scroll/bar';
import wheel from '@any-scroll/wheel';

export default class extends Core {
    constructor(el: HTMLElement, options?: Options) {
        super(el, options);
        // 加载预设插件
        bar(this);
        wheel(this);
    }
}
