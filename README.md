# any-scroll  [![NPM Version][npm-image]][npm-url] [![NPM Downloads][downloads-image]][downloads-url] [![npm bundle size (minified + gzip)][size-image]][size-url] 


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

内容会同步到到掘金
https://juejin.im/post/5ca982aff265da24f741ec21
