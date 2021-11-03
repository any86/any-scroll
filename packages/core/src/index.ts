import _wrap,{Options as _Options} from './wrap';
import _content from './content';

export const Wrap = _wrap;
export const Content = _content;
export type Options = _Options;
// console.log(process.env)
// 插件队列
const plugins: ((content: InstanceType<typeof Wrap>) => void)[] = [];
export default class extends Wrap {
    /**
     * 加载插件
     * @param plugin 插件
     */
    static use(plugin: any) {
        plugins.push(plugin);
    }

    constructor(el: HTMLElement, options?: Options) {
        super(el, options);
        // 初始化插件
        for (const plugin of plugins) {
            plugin(this);
        }
    }
}