import _wrap, { Options as _Options } from './wrap';
import _content from './content';

export const Wrap = _wrap;
export const Content = _content;
export type Options = _Options;
export type PluginOptions = Record<string | number | symbol, any>;
export interface Plugin {
    (context: InstanceType<typeof Wrap>, options?: PluginOptions): unknown;
}


// console.log(process.env)
export default class extends Wrap {
    /**
     * 
     * @param el wrap目标元素
     * @param options 选项 
     */
    constructor(el: HTMLElement, options?: Options) {
        super(el, options);
    }

    /**
     * 加载插件
     * @param plugin 插件
     */
    public use(plugin: Plugin, options: PluginOptions) {
        plugin(this, options);
    }
}
