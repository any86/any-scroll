# any-scroll
模拟滚动插件, 手势识别基于[any-touch](https://github.com/any86/any-touch).

## 目录
- [概念](#概念wrapcontent)
- [安装](#安装)
- [使用](#使用)
- [API](#API)
    - [选项](#选项)
    - [实例属性](#实例属性)
        - [el : wrap元素](#el)
        - [size : wrap元素尺寸](#size)
        - [contentSize : content元素尺寸](#contentSize)
        - [at : any-touch实例](#at)
    - [实例方法](#实例方法)
        - [on : 监听事件](#on)
        - [scrollTo : 动画滚动](#scrollTo)
        - [moveTo : 瞬移](#moveTo)
        - [dampScroll : 衰减滚动](#dampScroll)
        - [update : 更新"可滑动范围"](#update)
- [常见问题](#常见问题)
    - [监视内容变化](#监视内容变化)


## 概念(wrap/content)
any-scroll的滚动实际是通过2个"**父子div**"的相对位置变化模拟的, 外层div叫"**wrap**", 里面用来装载内容的div叫"**content**".
```html
<div role="wrap">
    <div role="content" style="transform:translate3d(100px,100px,0)">
        <!--自定义内容放在这里-->
    <div>
</div>
```

![GIF](https://user-images.githubusercontent.com/8264787/146702700-304115ca-55ef-46b9-85d6-d6c3fa02683c.gif)
[🚀返回目录](#目录)


## 安装
```shell
npm i any-scroll -S
```
[🚀返回目录](#目录)

## 使用
首先在页面构造如下html结构.
```html
<div id="scroll-view">
    <div><div>
</div>
```

初始化
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
- [on : 监听事件](#on)
- [scrollTo : 动画滚动](#scrollTo)
- [moveTo : 瞬移](#moveTo)
- [dampScroll : 衰减滚动](#dampScroll)
- [update : 重新计算wrap/content尺寸](#update)

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
[:rocket: 返回目录](#API)

#### scrollTo
滚动到指定位置, 支持时间动画

##### 参数
|参数名|参考值|必填|说明|
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

[:rocket: 返回目录](#API)

#### moveTo
瞬间移动到目标位置
|参数名|参考值|必填|说明|
|---|---|---|---|
|**distXY**|`[-100,-200]`或`{x:-100,y:-200}`|必选|目标位置|
```javascript
as.moveTo([-100,-200]);
```
[:rocket: 返回目录](#API)

#### dampScroll
作用同scrollTo,只是滚动效果不同, 其不能指定时间. 仅供插件开发者使用, 模拟快速划动scrollView产生的滚动.

#### 参数
|参数名|参考值|必填|说明|
|---|---|---|---|
|**distXY**|`[-100,-200]`或`{x:-100,y:-200}`|必选|目标位置|
|**damping**|默认0.1, 范围0~1|可选|不断靠近目标位置,每次靠近剩余距离的0.1倍.|
```javascript
as.dampScroll([-100,-200]);
```
[:rocket: 返回目录](#API)

#### update
如果滚动范围出现异常, 可手动更新.
```javascript
as.update();
```
[:rocket: 返回目录](#API)


### 实例属性

- [el : wrap元素](#el)
- [size : wrap元素尺寸](#size)
- [contentSize : content元素尺寸](#contentSize)
- [at : any-touch实例](#at)



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
未完

[🚀返回目录](#目录)
#### contentSize
未完

[🚀返回目录](#目录)

## 常见问题

- [监视内容变化](#监视内容变化)

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