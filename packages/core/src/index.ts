import _wrap from './wrap';
export interface Options {
    // 允许超过边界的最大距离
    overflowDistance?: number;
    // 减速系数
    damping?: number;
    // 允许X&Y轴线滑动
    allow?: [boolean, boolean];

    hideBar?: [boolean, boolean];
    // 超出界限后自动吸附边框
    snap?: boolean;
    // 是否允许滑动出界限, 超过tolerance
    // limit?: [XY,XY];
    hasBar?: boolean;
}
export const Wrap = _wrap;

const plugins: any[] = [];
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