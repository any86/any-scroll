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

[🚀返回目录](#目录)


## 目录
- [概念](#概念wrapcontent)
- [安装](#安装)
- [使用](#使用)
- [API](#API)
    - [选项](#选项)
    - [实例属性](#实例属性)
        - [el : wrap元素](#el)
        - [size : wrap元素尺寸](#size)
        - [at : any-touch实例](#at)
    - [实例方法](#实例方法)
        - [on : 监听事件](#on)
        - [scrollTo : 动画滚动](#scrollto)
        - [moveTo : 瞬移](#moveto)
        - [scrollToElement : 移动元素到wrap左上角](#scrolltoelement)
        - [dampScroll : 衰减滚动](#dampscroll)
        - [update : 更新"可滑动范围"](#update)
        - [getContentRef : 获取content实例(其上有尺寸数据)](#getcontentref)
        - [active : 激活content实例"](#active)
    - [事件](#事件)
        - [scroll : 滚动](#事件)
        - [scrollEnd : 滚动结束](#事件)
        - [tap : 单击](#事件)
        - [press : 按压](#事件)
        - [pressup : 按压释放](#事件)
        - [pan : 拖拽](#事件)
        - [swipe : 滑动](#事件)
        - [pinch : 缩放](#事件)
        - [rotate : 旋转](#事件)
- [常见问题](#常见问题)
    - [no-scroll : 不滚动](#no-scroll)
    - [ResizeObserver : 监视内容变化](#监视内容变化)


## 安装
```shell
npm i any-scroll -S
```
[🚀返回目录](#目录)

## 使用
首先在页面构造如下html结构, 同时**给wrap一个固定尺寸**. 
```html
<div id="scroll-view" style="height:600px;width:360px;"><!-- wrap -->
    <div><!-- content -->
        <!-- 你的内容写在这里 -->
    <div>
</div>
```

初始化:
```javascript
import AnyScroll from 'any-scroll';
const el = document.getElementById('scroll-view');
const as = new AnyScroll(el);

// 滚动到x=-100,y=-100的位置.
as.scrollTo([-100,-100]);

// 只控制Y轴,1s内滑动到目标位置
as.scrollTo({y:-100},1000);
```
[🚀返回目录](#目录)

## API
- [选项](#选项)
- [实例属性](#实例属性)
- [实例方法](#实例方法)
- [事件](#事件)
### 选项
|名称|默认值|说明|
|---|---|---|
|**allow**|`[true,true]`|是否允许X或Y轴滚动,数组第一位控制X轴|
|**damping**|`0.1`|[dampScroll](#dampScroll)的消损系数,范围0~1|
|**overflowDistance**|`100`|允许超过边界的最大距离,单位"px"|
|[render](#render)|[查看](#render)|控制content元素位置变化的函数|

#### render
默认通过**translate3d**控制content的位移, 如有需要也可改为控制**margin**或 **top(left)** 属性.
```javascript
// 默认
function render(el, [x, y]) {
    el.style.setProperty('transform',`translate3d(${x}px, ${y}px,0)`);
}

// 或者改为
function render(el, [x, y]) {
    el.style.setProperty('marginLeft', x+'px');
    el.style.setProperty('marginTop', y+'px');
}

const as = new AnyScroll({render});
```
[🚀返回目录](#目录)

### 实例方法


#### on
监听事件, 默认继承了[any-touch](https://github.com/any86/any-touch)的所有手势事件.
|事件名|说明|
|---|---|
|scroll|每次滚动|
|scroll-end|滚动停止|
|tap|单击|
|press|按压|
|pan|拖拽|
|swipe|快滑|
|rotate|旋转|
|pinch|缩放|

```javascript
as.on('scroll-end',()=>{
    console.log('滚动停止了');
})
```
[:rocket: 返回目录](#目录)

#### scrollTo
滚动到指定位置, 支持时间动画

##### 参数
|参数名|参考值|是否可选|说明|
|---|---|---|---|
|**distXY**|`[-100,-200]`或`{x:-100,y:-200}`|必选|目标位置|
|**duration**|1000|可选|滚动时间,单位毫秒|
|**easing**|[参考](https://github.com/component/ease/blob/master/index.js)|可选|缓动动画函数, 一般不需要修改|

```javascript
// 3秒钟移动到x=-100,y=-500的位置.
as.scrollTo([-100,-500],3000);
// 等价写法
as.scrollTo({x:100,y:-500},3000);
```

[:rocket: 返回目录](#目录)

#### moveTo
瞬间移动到目标位置
|参数名|参考值|是否可选|说明|
|---|---|---|---|
|**distXY**|`[-100,-200]`或`{x:-100,y:-200}`|必选|目标位置|
```javascript
as.moveTo([-100,-200]);
```
[:rocket: 返回目录](#目录)

#### scrollToElement
移动元素到wrap左上角.
##### 参数
|参数名|参考值|是否可选|说明|
|---|---|---|---|
|**el**|DOM元素|必选|目标元素|
|**offset**|`[0,0]`或`{x:0,y:0}`|可选|对目标位置修正, 多滚动的距离|
|**duration**|1000|可选|滚动时间,单位毫秒|
|**easing**|[参考](https://github.com/component/ease/blob/master/index.js)|可选|缓动动画函数, 一般不需要修改|

```javascript
// 滚动到content中的子元素(child-1), 让其左上角和wrap的左上角重合.
const childEl = doucument.getElementById('child-1');
as.scrollToElement(childEl);
// 滚动到child-1下方100px的位置
as.scrollToElement(childEl,{y:100});
// 等价写法
as.scrollToElement(childEl,[,100]);
```

[:rocket: 返回目录](#目录)


#### dampScroll
作用同scrollTo,只是滚动效果不同, 其不能指定时间. 仅供插件开发者使用, 模拟快速划动scrollView产生的滚动.

##### 参数
|参数名|参考值|是否可选|说明|
|---|---|---|---|
|**distXY**|`[-100,-200]`或`{x:-100,y:-200}`|必选|目标位置|
|**damping**|默认0.1, 范围0~1|可选|不断靠近目标位置,每次靠近剩余距离的0.1倍.|
```javascript
as.dampScroll([-100,-200]);
```
[:rocket: 返回目录](#目录)

#### update
如果滚动范围出现异常, 可手动更新.
```javascript
as.update();
```
[:rocket: 返回目录](#目录)

#### getContentRef
获取content实例, 其上有尺寸等数据.
##### 参数
|参数名|参考值|是否可选|说明|
|---|---|---|---|
|**elOrIndex**|number或HTML元素|可选|[查看 ↓](#elOrIndex说明)|

##### elOrIndex不同的值
1. 如是number, 那么会按照wrap下的子元素索引取对应的content实例.
2. 如是元素, 那么会递归向上找父元素, 直到找到对应的实例.
3. 如果不传默认找当前[激活](#active)状态的content实例.

```javascript
as.getContentRef(1);
as.getContentRef(childEl);
as.getContentRef();

```
##### 返回值
content实例或`null`.

[:rocket: 返回目录](#目录)


#### active
如果有多个content实例, 激活指定content实例, 只有激活的content才会响应滚动. 

##### 参数
|参数名|是否可选|
|---|---|
|**contentRef**|必选|
```javascript
// 激活第二个content实例.
const contentRef = as.getContentRef(1);
as.active(contentRef);
```
[:rocket: 返回目录](#目录)



### 实例属性

#### el
wrap元素
```javascript
as.el; // <div class="any-scroll"></div>
```
[🚀返回目录](#目录)
#### at
any-scroll内部使用了any-touch手势库, 通过`as.at`可以访问any-touch的实例,从而修改手势行为等, [详情参考any-touch](https://github.com/any86/any-touch)
```javascript
// 仅对表单元素阻止触发"默认事件"
// 这是any-touch参数的默认值, 在此仅做展示
as.at.set({
    preventDefault(e){
        if (event.target && 'tagName' in event.target) {
            const { tagName } = event.target;
            return !/^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/.test(tagName);
        }
        return false;
    }
})
```
**注意:** 普通开发者谨慎使用, 修改不当会影响滚动效果, 如开发中遇到缺少功能, 大家尽量先[提Issue](https://github.com/any86/any-scroll/issues/new) 

[🚀返回目录](#目录)

#### size
wrap元素尺寸.
```javascript
console.log(as.size);
```

[🚀返回目录](#目录)

### 事件

```javascript
as.on('scroll', context=>{
    // 当前位置信息
    // context === as
    console.log(context.xy);
});
```
|事件名称|说明|
|---|---|
|**scroll**| 滚动|
|**scrollEnd**| 滚动结束|
|tap| 单击|
|press| 按压|
|pressup| 按压释放|
|pan| 拖拽|
|swipe| 滑动|
|pinch| 缩放|
|rotate| 旋转|


除了"**scroll**"和"**scroll-end**", 其他事件都是any-touch实现的, 其事件对象上包含当前触点/距离/速度等信息, 更多请参考[any-touch](https://github.com/any86/any-touch)

```javascript
as.on('tap', e=>{
    // 当前触点x坐标
    console.log(e.x)
})
```



[🚀返回目录](#目录)

## 常见问题

### no-scroll
如果wrap下的子元素, 有些你并不想让他"滚动", 可以给其加"no-scroll"标记.
```html
<div>
    <div></div> <!-- 能滚动 -->
    <div no-scroll></div> <!-- 不能滚动 -->
</div>
```

[🚀返回目录](#目录)

### 监视内容变化
当content中的子元素发生变化(增/减去/尺寸), any-scroll需要重新计算"**可滑动范围**".

默认any-scroll内部使用[ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)([caniuse](https://caniuse.com/?search=ResizeObserver))监视wrap/content尺寸变化, 实现自动更新可滑动范围.

![image](https://user-images.githubusercontent.com/8264787/147109689-ba1aeb91-da96-4a24-8ab1-29254c772f34.png)

但其兼容性较差, 所以在不支持ResizeObserver的浏览器会使用[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)([caniuse](https://caniuse.com/?search=MutationObserver))降级兼容, 其只能监视content的子元素的增/减, 从而更新滑动范围.
![image](https://user-images.githubusercontent.com/8264787/147110880-a7c2f72f-82ba-4286-af8a-351332f00f4c.png)


#### resize-observer-polyfill
如果不在意体积, 可以使用"**resize-observer-polyfill**", 其可让ResizeObserver[兼容到最低IE9](https://github.com/juggle/resize-observer#tested-browsers).
```javascript
import ResizeObserver from 'resize-observer-polyfill';
// ⭐注入到全局
window.ResizeObserver = ResizeObserver;

import AnyScroll from 'any-scroll';
const as = new AnyScroll(el);
```

##### 手动更新
使用实例上的"[update](#update)"方法更新"可滑动范围". 

[🚀返回目录](#目录)