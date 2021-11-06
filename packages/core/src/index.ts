import _wrap, { Options as _Options } from './wrap';
import _content from './content';

export const Wrap = _wrap;
export const Content = _content;
export type Options = _Options;

export interface Plugin {
    (content: InstanceType<typeof Wrap>, options?: unknown): unknown;
}
// console.log(process.env)
const plugins: Plugin[] = [];

export default class extends Wrap {
    /**
     * 加载插件
     * @param plugin 插件
     */
    static use(plugin: Plugin) {
        plugins.push(plugin);
    }

    /**
     * 
     * @param el wrap目标元素
     * @param options 选项 
     */
    constructor(el: HTMLElement, options?: Options) {
        // 加载插件
        plugins.forEach((plugin) => {
            plugin(this);
        });
        super(el, options);
    }
}
