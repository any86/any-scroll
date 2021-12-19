# any-scroll
纯JS滚动插件, 手势识别基于[any-touch](https://github.com/any86/any-touch).

## 安装
```shell
npm i any-scroll -S
```

## 使用

```javascript
import AScroll from 'any-scroll';
const as = new AScroll(el);
as.scrollTo([-100,-100]);
// 只控制Y轴,1s内滑动到目标位置
as.scrollTo({y:-100},1000);
```

## API
- [scrollTo: 动画滚动](#scrollTo)
- [moveTo: 瞬移](#moveTo)
- [dampScroll: 衰减滚动](#dampScroll)

### scrollTo
滚动到指定位置, 支持时间动画

#### 参数
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

### moveTo
瞬间移动到目标位置
|参数名|参考值|必填|说明|
|---|---|---|---|
|**distXY**|`[-100,-200]`或`{x:-100,y:-200}`|必选|目标位置|

[:rocket: 返回目录](#API)

### dampScroll
滚动到指定位置, 减速滚动,但不能指定时间. 仅供插件开发者使用, 模拟快速划动scrollView产生的滚动.

#### 参数
|参数名|参考值|必填|说明|
|---|---|---|---|
|**distXY**|`[-100,-200]`或`{x:-100,y:-200}`|必选|目标位置|
|**damping**|默认0.1,|可选|不断靠近目标位置,每次靠近剩余距离的0.1倍.|

[:rocket: 返回目录](#API)
