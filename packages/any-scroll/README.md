# any-scroll [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![size-image]][size-url] 

[size-image]: https://badgen.net/bundlephobia/minzip/any-scroll
[size-url]: https://bundlephobia.com/result?p=any-scroll
[npm-image]: https://badgen.net/npm/v/any-scroll
[npm-url]: https://npmjs.org/package/any-scroll
[downloads-image]: https://badgen.net/npm/dt/any-scroll
[downloads-url]: https://npmjs.org/package/any-scroll

模拟滚动插件,支持滚轮和手势, 手势识别基于[any-touch](https://github.com/any86/any-touch).

## 概念(wrap/content)
any-scroll的滚动实际是通过2个"**父子div**"的相对位置变化模拟的, 默认使用translate3d, 外层div叫"**wrap**", 里面用来装载内容的div叫"**content**".
```html

<div> <!-- warp --> 
    <div> <!-- content -->
        content
    <div>
</div>
```

![GIF](https://user-images.githubusercontent.com/8264787/146702700-304115ca-55ef-46b9-85d6-d6c3fa02683c.gif)

### ⚡⚡⚡ 多个content
如果wrap下有多个元素, 那么any-scroll会把他们都构造成content实例, 但是只有一个"**激活**"状态的content实例, 只有他可以响应滚动, 当然你也可以切换任意content实例为[激活](#active).
```html
<!-- warp --> 
<div> 
    <!-- content -->
    <div>content-1<div> 

    <!-- content -->
    <div style="position: absolute;z-index:1;top:0;left:0;">
        content-2
    <div> 
    
    <!-- content -->
    <div no-scroll>content-3<div> 
</div>
```
**注意**: 
1. 多个content情况下, 请给第二个子元素做一个"初始定位", 比如`style="position: absolute;z-index:1;top:0;left:0;"`, any-scroll内部没有默认定位, 这样你可以自定义"位置"和"层级".
2. 如果不想某个子元素(content)"可滚动", 使用"**no-scroll**"进行标记. 

## 文档
[查看更多](https://github.com/any86/any-scroll)