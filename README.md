# any-scroll  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] 
模拟scrollview, 基于vue制作, 可加工成Tab/SwipeOut/Slider/Carousel等组件.

[size-image]: https://img.shields.io/bundlephobia/minzip/any-scroll.svg
[size-url]: https://bundlephobia.com/result?p=any-scroll
[npm-image]: https://img.shields.io/npm/v/any-scroll.svg
[npm-url]: https://npmjs.org/package/any-scroll

[downloads-image]: https://img.shields.io/npm/dm/any-scroll.svg
[downloads-url]: https://npmjs.org/package/any-scroll

## 安装
```shell
npm i -S any-scroll
```

## 使用
```html
<any-scroll>
  <p>第一行</p>
  <p>第二行</p>
  ...
</any-scroll>
```

``` javascript
import AnyScroll from 'any-scroll'
new Vue({
  components: {AnyScroll}
});
```
##


## 什么时候用
1. 模拟scrollview, 规避ios下系统的scrollview拖拽到2端出现空白的bug.
...



## props
|属性|数据类型|默认值|说明|
|---|---|---|---|
|height|`String`|500px|scrollView的高度,可以给`100%`让其填满父元素高度,或者`100vh`和浏览器一样高|
|width|`String`|-|scrollView的宽度|
|overflowX|`Boolean`|true|x轴是否可以滚动|
|overflowY|`Boolean`|true|y轴是否可以滚动|
|bounceDistance|`Number | Object`|150|4个边界的可拉伸距离, 如果是对象, 可以通过top/left/right/bottom单独配置每一边|
|bounceTime|`Number`|100|回弹时间, 单位ms|
|easeFunction|`Function`|`const t => (t - 1) ** 3 + 1`| 根据时间变化的输出的值从0到1的曲线
