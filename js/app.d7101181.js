(function(t){function e(e){for(var n,a,l=e[0],c=e[1],s=e[2],u=0,h=[];u<l.length;u++)a=l[u],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&h.push(i[a][0]),i[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);d&&d(e);while(h.length)h.shift()();return r.push.apply(r,s||[]),o()}function o(){for(var t,e=0;e<r.length;e++){for(var o=r[e],n=!0,l=1;l<o.length;l++){var c=o[l];0!==i[c]&&(n=!1)}n&&(r.splice(e--,1),t=a(a.s=o[0]))}return t}var n={},i={app:0},r=[];function a(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,a),o.l=!0,o.exports}a.m=t,a.c=n,a.d=function(t,e,o){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(o,n,function(e){return t[e]}.bind(null,n));return o},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],c=l.push.bind(l);l.push=e,l=l.slice();for(var s=0;s<l.length;s++)e(l[s]);var d=c;r.push([0,"chunk-vendors"]),o()})({0:function(t,e,o){t.exports=o("56d7")},"001a":function(t,e,o){e=t.exports=o("690e")(!1),e.push([t.i,"*{padding:0;margin:0}.fade-up-enter-active,.fade-up-leave-active{-webkit-transition:all .5s;transition:all .5s}.fade-up-enter,.fade-up-leave-to{opacity:0;-webkit-transform:translateY(-30px);transform:translateY(-30px)}.fade-down-enter-active,.fade-down-leave-active{-webkit-transition:all .5s;transition:all .5s}.fade-down-enter,.fade-down-leave-to{opacity:0;-webkit-transform:translateY(30px);transform:translateY(30px)}main{overflow:hidden}main>header h1{width:100%;text-align:center;padding:15px}main>article.body{display:-webkit-box;display:-ms-flexbox;display:flex;padding:2%}main>article.body>.props-form{-webkit-box-flex:1;-ms-flex:1;flex:1;padding:15px;border:1px solid #eee;-webkit-box-shadow:1px 2px 3px rgba(0,0,0,.1);box-shadow:1px 2px 3px rgba(0,0,0,.1)}main>article.body>.props-form label{display:-webkit-box;display:-ms-flexbox;display:flex;margin-top:15px;-ms-flex-line-pack:center;align-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:0 5px;word-break:keep-all}main>article.body>.props-form label input{margin-left:10px;outline:none;width:100%;padding:10px;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:14px;border-radius:4px;border:1px solid #ddd}main>article.body>.scroll-view{width:360px;-ms-flex-negative:0;flex-shrink:0;margin-left:2%;-webkit-box-shadow:1px 2px 3px rgba(0,0,0,.1),-1px -2px 3px rgba(0,0,0,.1);box-shadow:1px 2px 3px rgba(0,0,0,.1),-1px -2px 3px rgba(0,0,0,.1)}main>article.body>.scroll-view .header{padding:15px;color:#fff;background:rgba(0,0,0,.4);width:100%;-webkit-box-shadow:1px 2px 1px rgba(0,0,0,.2);box-shadow:1px 2px 1px rgba(0,0,0,.2)}main>article.body>.scroll-view .footer{padding:15px;color:#fff;background:rgba(0,0,0,.4);width:100%;-webkit-box-shadow:1px -2px 1px rgba(0,0,0,.2);box-shadow:1px -2px 1px rgba(0,0,0,.2)}main>article.body>.scroll-view .loading{display:block;width:72px;height:72px;border-bottom-width:0;border-top-width:0;border-color:#aaa;border-radius:100%;border-right-width:4px;border-left-width:4px;border-style:solid;-webkit-animation:rotate .5s linear infinite;animation:rotate .5s linear infinite;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0}@-webkit-keyframes rotate{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes rotate{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}main>article.body>.scroll-view label{-webkit-box-sizing:border-box;box-sizing:border-box;width:60%;padding:15px}main>article.body>.scroll-view label input,main>article.body>.scroll-view label textarea{-webkit-box-sizing:border-box;box-sizing:border-box;display:block;width:60%;padding:5px 15px}main>article.body>.scroll-view label button{-webkit-box-sizing:border-box;box-sizing:border-box;padding:5px 45px}main>article.body>.scroll-view ul{width:180%}main>article.body>.scroll-view ul li{font-size:16px;list-style-type:none;padding:15px;height:29px;margin:0;border-bottom:1px solid #ddd;background:#ddd;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}main>article.body>.scroll-view ul li img{width:30px;height:30px;margin-right:10px}main>article.body>.scroll-view ul li:nth-child(2n){background:#fff}main>article.body>.dataAndMethods{-webkit-box-flex:1;-ms-flex:1;flex:1;margin-left:2%;padding:0 2%}main>article.body>.dataAndMethods table{padding:10px;border-spacing:0;-webkit-box-shadow:1px 2px 3px rgba(0,0,0,.1);box-shadow:1px 2px 3px rgba(0,0,0,.1);border:1px solid rgba(0,0,0,.1);width:100%}main>article.body>.dataAndMethods table tr td{padding:10px;line-height:1.5;text-align:start;border-bottom:1px solid transparent;color:#000}main>article.body>.dataAndMethods table tr td:first-child{width:150px}main>article.body>.dataAndMethods table tr:hover td{-webkit-transform:translateX(15px);transform:translateX(15px);-webkit-transition:-webkit-transform .6s;transition:-webkit-transform .6s;transition:transform .6s;transition:transform .6s,-webkit-transform .6s}main>article.body>.dataAndMethods table tr:nth-of-type(odd){background:#eee}main>article.body>.dataAndMethods button{border:1px solid #eee;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none;border-radius:4px;font-size:16px;margin-top:15px;margin-right:15px;padding:10px 30px;background:#e60044;color:#fff;width:100%;-webkit-box-shadow:1px 2px 2px rgba(0,0,0,.1);box-shadow:1px 2px 2px rgba(0,0,0,.1)}main>article.body>.dataAndMethods button:active{-webkit-box-shadow:1px 1px 1px #fff inset;box-shadow:inset 1px 1px 1px #fff}",""])},"56d7":function(t,e,o){"use strict";o.r(e);o("96dd"),o("a60a"),o("e783"),o("8b1f");var n=o("6e6d"),i=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("main",[t._m(0),o("article",{staticClass:"body"},[o("article",{staticClass:"props-form"},[o("h1",[t._v("设置")]),o("label",[t._v("\n        height(高度)\n        "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.height,expression:"height"}],attrs:{placeholder:"scrollView的高度, 默认500px"},domProps:{value:t.height},on:{input:function(e){e.target.composing||(t.height=e.target.value)}}})]),o("label",[t._v("\n        width(宽度)\n        "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.width,expression:"width"}],attrs:{placeholder:"不指定宽度, 默认100%;"},domProps:{value:t.width},on:{input:function(e){e.target.composing||(t.width=e.target.value)}}})]),o("label",[t._v("\n        bounceDistance(可拉伸距离)\n        "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.bounceDistance,expression:"bounceDistance"}],domProps:{value:t.bounceDistance},on:{input:function(e){e.target.composing||(t.bounceDistance=e.target.value)}}})]),o("label",{staticClass:"inline"},[t._v("\n        overflowX(禁止x轴运动)\n        "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.overflowX,expression:"overflowX"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.overflowX)?t._i(t.overflowX,null)>-1:t.overflowX},on:{change:function(e){var o=t.overflowX,n=e.target,i=!!n.checked;if(Array.isArray(o)){var r=null,a=t._i(o,r);n.checked?a<0&&(t.overflowX=o.concat([r])):a>-1&&(t.overflowX=o.slice(0,a).concat(o.slice(a+1)))}else t.overflowX=i}}})]),o("label",{staticClass:"inline"},[t._v("\n        overflowY(禁止y轴运动)\n        "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.overflowY,expression:"overflowY"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.overflowY)?t._i(t.overflowY,null)>-1:t.overflowY},on:{change:function(e){var o=t.overflowY,n=e.target,i=!!n.checked;if(Array.isArray(o)){var r=null,a=t._i(o,r);n.checked?a<0&&(t.overflowY=o.concat([r])):a>-1&&(t.overflowY=o.slice(0,a).concat(o.slice(a+1)))}else t.overflowY=i}}})]),o("label",{staticClass:"inline"},[t._v("\n        isShowXBar(显示x滚动条)\n        "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.isShowXBar,expression:"isShowXBar"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.isShowXBar)?t._i(t.isShowXBar,null)>-1:t.isShowXBar},on:{change:function(e){var o=t.isShowXBar,n=e.target,i=!!n.checked;if(Array.isArray(o)){var r=null,a=t._i(o,r);n.checked?a<0&&(t.isShowXBar=o.concat([r])):a>-1&&(t.isShowXBar=o.slice(0,a).concat(o.slice(a+1)))}else t.isShowXBar=i}}})]),o("label",{staticClass:"inline"},[t._v("\n        isShowYBar(显示y滚动条)\n        "),o("input",{directives:[{name:"model",rawName:"v-model",value:t.isShowYBar,expression:"isShowYBar"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.isShowYBar)?t._i(t.isShowYBar,null)>-1:t.isShowYBar},on:{change:function(e){var o=t.isShowYBar,n=e.target,i=!!n.checked;if(Array.isArray(o)){var r=null,a=t._i(o,r);n.checked?a<0&&(t.isShowYBar=o.concat([r])):a>-1&&(t.isShowYBar=o.slice(0,a).concat(o.slice(a+1)))}else t.isShowYBar=i}}})])]),o("any-scroll",{ref:"scroll",staticClass:"scroll-view",attrs:{width:t.width,height:t.height,"is-show-x-bar":t.isShowXBar,"is-show-y-bar":t.isShowYBar,"overflow-x":t.overflowX,"overflow-y":t.overflowY,"bounce-distance":t.bounceDistance,"bounce-time":1e3},on:{"bounce-state-change":function(e){t.bounceState=e},"scroll-state-change":function(e){t.scrollState=e},scroll:t.scrollHandler},scopedSlots:t._u([{key:"top",fn:function(e){var n=e.scrollTop,i=e.scrollLeft,r=e.directionY;return[o("transition",{attrs:{name:"fade-up"}},[0>=n||"up"===r?o("div",{staticClass:"header"},[t._v("scroll: "+t._s(i)+" | "+t._s(n)+' 我是插槽, slot="top"')]):t._e()])]}},0<t.data.length?{key:"under",fn:function(){return[o("h1",[t._v("我在后面")])]},proxy:!0}:null,{key:"bottom",fn:function(e){var n=e.scrollTop,i=e.scrollLeft,r=e.directionY;return[o("transition",{attrs:{name:"fade-down"}},["down"===r?o("div",{staticClass:"footer"},[t._v("scroll: "+t._s(i)+" | "+t._s(n)+' | 我是插槽, slot="bottom"')]):t._e()])]}}],null,!0)},[0<t.data.length?o("ul",[o("li",[o("label",[o("input",{attrs:{placeholder:"请输入标题"}})])]),o("li",[o("label",[o("textarea",{attrs:{placeholder:"请输入内容"}})])]),o("li",[o("label",[o("button",{staticStyle:{background:"#efe"}},[t._v("提交")])])]),t._l(t.data,(function(e,n){var i=e.title;e.author;return o("li",{key:i+n},[t._v("\n          "+t._s(n)+" | "+t._s(i)+"\n        ")])}))],2):o("span",{staticClass:"loading"})]),o("article",{staticClass:"dataAndMethods"},[o("table",[o("tr",[o("td",[t._v("🌀 弹簧状态")]),o("td",[t._v("\n            顶部: "+t._s(t.bounceState.top)+"\n            "),o("br"),t._v("\n            右侧: "+t._s(t.bounceState.right)+"\n            "),o("br"),t._v("\n            底部: "+t._s(t.bounceState.bottom)+"\n            "),o("br"),t._v("\n            左侧: "+t._s(t.bounceState.left)+"\n          ")])]),o("tr",[o("td",[t._v("🚂 滚动状态")]),o("td",[t._v("\n            X轴: "+t._s(t.scrollState.x)+"\n            "),o("br"),t._v("\n            Y轴: "+t._s(t.scrollState.y)+"\n          ")])]),o("tr",[o("td",[t._v("↔ scrollLeft")]),o("td",[t._v(t._s(t.scrollLeft))])]),o("tr",[o("td",[t._v("↕ scrollTop")]),o("td",[t._v(t._s(t.scrollTop))])])]),o("div",{staticClass:"form"},[o("button",{on:{click:t.test}},[t._v("测试")]),o("button",{on:{click:t.scrollUp}},[t._v("模拟拖拽向上")]),o("button",{on:{click:t.scrollDown}},[t._v("模拟拖拽向下")]),o("button",{on:{click:t.scrollLeftHandler}},[t._v("模拟拖拽向左")]),o("button",{on:{click:t.scrollRightHandler}},[t._v("模拟拖拽向右")]),o("button",{on:{click:t.reset}},[t._v("复位")])])])],1)])},r=[function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("header",[o("h1",[t._v("AnyScroll")])])}],a=(o("63ff"),o("f8f9")),l="static",c="drag-scroll",s="animate-scroll",d="stretched",u="shrink",h="top",f="right",p="bottom",b="left",m="up",v="right",w="left",x="down",g=[h,f,p,b],y=["Top","Right","Bottom","Left"],S="X",Y="Y",X=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"any-scroll-view",style:t.viewStyle},[t.$slots.top||t.$scopedSlots.top?o("header",{staticClass:"any-scroll-view__top"},[t._t("top",null,{scrollTop:t.scrollY,scrollLeft:t.scrollX,directionX:t.directionX,directionY:t.directionY})],2):t._e(),t.$slots.upper||t.$scopedSlots.upper?o("section",{staticClass:"any-scroll-view__upper"},[t._t("upper",null,{scrollTop:t.scrollY,scrollLeft:t.scrollX,directionX:t.directionX,directionY:t.directionY})],2):t._e(),t.$slots.under||t.$scopedSlots.under?o("section",{staticClass:"any-scroll-view__under"},[t._t("under",null,{scrollTop:t.scrollY,scrollLeft:t.scrollX,directionX:t.directionX,directionY:t.directionY})],2):t._e(),o("scroll-bar",{attrs:{"is-show-x":t.isShowXBar,"is-show-y":t.isShowYBar,"scroll-x-state":t.scrollXState,"scroll-y-state":t.scrollYState,"scroll-x":t.scrollX,"scroll-y":t.scrollY,"overflow-x":t.overflowX,"overflow-y":t.overflowY,"content-width":t.contentWidth,"content-height":t.contentHeight,"view-width":t.viewWidth,"view-height":t.viewHeight,"is-out-of-top":t.isOutOfTop,"is-out-of-left":t.isOutOfLeft,"is-out-of-right":t.isOutOfRight,"is-out-of-bottom":t.isOutOfBottom,outOfTopDistance:t.outOfTopDistance,outOfBottomDistance:t.outOfBottomDistance,outOfRightDistance:t.outOfRightDistance,outOfLeftDistance:t.outOfLeftDistance}}),o("div",{ref:"content",staticClass:"any-scroll-view__content",style:t.contentStyle},[t._t("default",null,{scrollTop:t.scrollY,scrollLeft:t.scrollX,directionX:t.directionX,directionY:t.directionY})],2),t.$slots.bottom||t.$scopedSlots.bottom?o("footer",{staticClass:"any-scroll-view__bottom"},[t._t("bottom",null,{scrollTop:t.scrollY,scrollLeft:t.scrollX,directionX:t.directionX,directionY:t.directionY})],2):t._e()],1)},_=[],B=(o("4b5e"),o("6c28"),o("4634"),o("a5d2")),O=(o("8f42"),o("17f7")),k=o("45fc"),D=o.n(k),$=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[t.isShowX&&!t.overflowX?o("div",{staticClass:"any-scroll__bar-x",style:t.styleX}):t._e(),t.isShowY&&!t.overflowY?o("div",{staticClass:"any-scroll__bar-y",style:t.styleY}):t._e()])},T=[],M=(o("efce"),o("ed8b"),o("97a3"));function H(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function W(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?H(o,!0).forEach((function(e){Object(M["a"])(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):H(o).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var A={name:"ScrollBar",props:{isShowX:{type:Boolean,default:!0},isShowY:{type:Boolean,default:!0},scrollX:{type:Number},scrollY:{type:Number},overflowX:{type:Boolean},overflowY:{type:Boolean},scrollXState:{type:String},scrollYState:{type:String},contentWidth:{type:Number},contentHeight:{type:Number},viewWidth:{type:Number},viewHeight:{type:Number},width:{type:Number,default:6},height:{type:Number,default:6},color:{type:String,default:"rgba(0,0,0,0.4)"},isOutOfTop:{type:Boolean},isOutOfLeft:{type:Boolean},isOutOfRight:{type:Boolean},isOutOfBottom:{type:Boolean},outOfTopDistance:{type:Number},outOfBottomDistance:{type:Number},outOfRightDistance:{type:Number},outOfLeftDistance:{type:Number}},computed:{progressX:function(){return this.overflowX?0:Math.round(this.scrollX/(this.contentWidth-this.viewWidth)*100)},progressY:function(){return this.overflowY?0:Math.round(this.scrollY/(this.contentHeight-this.viewHeight)*100)},commonStyle:function(){return{backgroundColor:this.color,zIndex:1986,position:"absolute",transition:"opacity 300ms"}},styleX:function(){if(!this.overflowX){var t=Math.min(100,Math.max(0,this.progressX)),e=1,o="";return this.isOutOfLeft?(o="left",e=this.viewWidth/(this.viewWidth+Math.abs(this.outOfLeftDistance))):this.isOutOfRight&&(o="right",e=this.viewWidth/(this.viewWidth+Math.abs(this.outOfRightDistance))),W({},this.commonStyle,{opacity:l===this.scrollXState?0:1,borderRadius:"".concat(this.height,"px"),bottom:0,left:"".concat(t,"%"),height:"".concat(this.height,"px"),width:"".concat(.2*this.viewWidth,"px"),transform:"translateX(".concat(0-t,"%) scaleX(").concat(e,")"),transformOrigin:o})}},styleY:function(){if(!this.overflowY){var t=Math.min(100,Math.max(0,this.progressY)),e=1,o="";return this.isOutOfTop?(o="top",e=this.viewHeight/(this.viewHeight+Math.abs(this.outOfTopDistance))):this.isOutOfBottom&&(o="bottom",e=this.viewHeight/(this.viewHeight+Math.abs(this.outOfBottomDistance))),W({},this.commonStyle,{opacity:l===this.scrollYState?0:1,borderRadius:"".concat(this.width,"px"),top:"".concat(t,"%"),right:0,height:"".concat(.2*this.viewHeight,"px"),width:"".concat(this.width,"px"),transform:"translateY(".concat(0-t,"%) scaleY(").concat(e,")"),transformOrigin:o})}}}},C=A,N=o("6691"),j=Object(N["a"])(C,$,T,!1,null,null,null),L=j.exports,z={name:"AnyScrollView",components:{ScrollBar:L},props:{damping:{type:[Number,String],default:.1,validator:function(t){return 0<t&&1>t}},bounceDistance:{type:[Number,String,Object],default:150},bounceTime:{type:[String,Number],default:500},easeFunction:{type:Function,default:function(t){return Math.pow(t-1,3)+1}},width:{type:[Number,String],default:320},height:{type:[Number,String],default:500},overflowX:{type:Boolean,default:!1},overflowY:{type:Boolean,default:!1},isShowXBar:{type:Boolean,default:!0},isShowYBar:{type:Boolean,default:!0}},data:function(){return{translateY:0,translateX:0,transitionDuration:0,contentHeight:0,contentWidth:0,viewWidth:0,viewHeight:0,rafId:null,scrollToRafId:null,scrollXState:l,scrollYState:l,topBounceState:l,bottomBounceState:l,leftBounceState:l,rightBounceState:l,directionX:void 0,directionY:void 0}},computed:{viewStyle:function(){var t=this.height==parseInt(this.height)?"".concat(this.height,"px"):this.height,e=this.width==parseInt(this.width)?"".concat(this.width,"px"):this.width;return{height:t,width:e}},contentStyle:function(){return{transform:"translate3d(".concat(this.translateX,"px, ").concat(this.translateY,"px, 0px)")}},scrollData:function(){return{scrollTop:this.scrollY,scrollLeft:this.scrollX}},scrollY:{get:function(){return-this.translateY},set:function(t){this.translateY=0-t}},scrollX:{get:function(){return-this.translateX},set:function(t){this.translateX=0-t}},topBounceDistance:function(){return Number(this.bounceDistance.top||this.bounceDistance)},rightBounceDistance:function(){return Number(this.bounceDistance.right||this.bounceDistance)},leftBounceDistance:function(){return Number(this.bounceDistance.left||this.bounceDistance)},bottomBounceDistance:function(){return Number(this.bounceDistance.bottom||this.bounceDistance)},minScrollYWithBounce:function(){return this.minScrollY-this.topBounceDistance},maxScrollYWithBounce:function(){return this.maxScrollY+this.bottomBounceDistance},minScrollXWithBounce:function(){return this.minScrollX-this.leftBounceDistance},maxScrollXWithBounce:function(){return this.maxScrollX+this.rightBounceDistance},minScrollY:function(){return 0},maxScrollY:function(){return this.contentHeight-this.viewHeight},minScrollX:function(){return 0},maxScrollX:function(){return this.contentWidth-this.viewWidth},isOutOfTop:function(){return this.minScrollY>this.scrollY},isOutOfLeft:function(){return this.minScrollX>this.scrollX},isOutOfBottom:function(){return this.maxScrollY<this.scrollY},isOutOfRight:function(){return this.maxScrollX<this.scrollX},outOfTopDistance:function(){return Math.max(0,this.minScrollY-this.scrollY)},outOfBottomDistance:function(){return Math.max(0,this.scrollY-this.maxScrollY)},outOfLeftDistance:function(){return Math.max(0,this.minScrollX-this.scrollX)},outOfRightDistance:function(){return Math.max(0,this.scrollX-this.maxScrollX)},bounceXState:function(){return l===this.leftBounceState?this.rightBounceState:this.leftBounceState},bounceYState:function(){return l===this.topBounceState?this.bottomBounceState:this.topBounceState}},watch:{width:function(){this.updateSize()},height:function(){this.updateSize()},bounceXState:function(t){this.$emit("bounce-state-change",{top:this.topBounceState,right:this.rightBounceState,bottom:this.bottomBounceState,left:this.leftBounceState})},bounceYState:function(t){this.$emit("bounce-state-change",{top:this.topBounceState,right:this.rightBounceState,bottom:this.bottomBounceState,left:this.leftBounceState})},scrollXState:function(t){this.$emit("scroll-state-change",{x:t,y:this.scrollYState})},scrollYState:function(t){this.$emit("scroll-state-change",{y:t,x:this.scrollXState})},scrollY:function(t,e){this.directionY=t>e?m:x,this.watchScrollXYHandler(t,e,Y)},scrollX:function(t,e){this.directionX=t>e?w:v,this.watchScrollXYHandler(t,e,S)}},mounted:function(){var t=this,e=new O["a"](this.$el);this.updateSize();try{var o=o||WebKitMutationObserver||MozMutationObserver,n=new o((function(){t.updateSize()}));n.observe(this.$refs.content,{subtree:!0,childList:!0})}catch(i){}this.$on("hook:destroy",(function(){e.destroy(),Object(B["a"])("at"),e=null,_observer.disconnect(),_observer=null})),e.on("inputstart",(function(e){t.stop(),t.$emit("stop-scroll",t.$scrollData)})),e.on("inputend",(function(e){t.panendHandler()})),e.on("panstart",(function(e){t.panstartHandler(e),t.$emit("panstart",e)})),e.on("panmove",(function(e){t.panmoveHandler(e),t.$emit("panmove",e)})),e.on("panend",(function(e){t.$emit("panend",e)})),e.on("swipe",(function(e){t.decelerate(e),t.$emit("swipe",e)})),e.on("tap",(function(e){t.$emit("tap",e)})),e.on("doubletap",(function(e){t.$emit("doubletap",e)}))},methods:{watchScrollXYHandler:function(){var t=this;this.$emit("direction-change",{x:this.directionX,y:this.directionY}),y.forEach((function(e,o){t["isOutOf".concat(e)]?u!==t["".concat(g[o],"BounceState")]&&(t["".concat(g[o],"BounceState")]=d):t["".concat(g[o],"BounceState")]=l})),this.$emit("scroll",this.scrollData)},updateSize:function(){var t=this;this.$nextTick((function(){t.viewWidth=t.$el.offsetWidth,t.viewHeight=t.$el.offsetHeight,t.contentWidth=t.$refs.content.scrollWidth,t.contentHeight=t.$refs.content.scrollHeight}))},stop:function(){D.a.cancel(this.scrollToRafId),D.a.cancel(this.rafId),this.scrollXState=l,this.scrollYState=l},panstartHandler:function(t){var e=t.deltaX,o=t.deltaY;t.x,t.y;this.dragMoveContent({deltaX:e,deltaY:o})},panmoveHandler:function(t){var e=t.deltaX,o=t.deltaY;this.dragMoveContent({deltaX:e,deltaY:o})},dragMoveContent:function(t){var e=t.deltaX,o=t.deltaY;0!==e&&(this.scrollXState=c),0!==o&&(this.scrollYState=c),this.scrollBy({deltaX:e,deltaY:o})},panendHandler:function(){this.scrollXState=l,this.scrollYState=l,this.snapToEdge()},scrollBy:function(t){var e=this;["X","Y"].forEach((function(o){if(!e["overflow".concat(o)]){var n=e["scroll".concat(o)]-t["delta".concat(o)];e["maxScroll".concat(o,"WithBounce")]<n?n=e["maxScroll".concat(o,"WithBounce")]:e["minScroll".concat(o,"WithBounce")]>n&&(n=e["minScroll".concat(o,"WithBounce")]),e["scroll".concat(o)]=n}}))},decelerate:function(t){var e=this;this.$emit("before-scroll",this.scrollData),D.a.cancel(this.rafId);var o=t.speedX,n=t.speedY,i=function(t){return~~(30*t)/e.damping};this._decelerateAnimation({x:i(u===this.bounceXState||this.overflowX?0:o),y:i(u===this.bounceYState||this.overflowY?0:n)})},_decelerateAnimation:function(t){var e=this;D.a.cancel(this.rafId);var o={x:0===t.x,y:0===t.y},n=["x","y"].filter((function(t){return!e["overflow".concat(t.toUpperCase())]&&!o[t]})),i={x:t.x,y:t.y};this.$emit("scroll-start",this.scrollData);var r=function t(){var r=!0,a=!1,c=void 0;try{for(var d,h=n[Symbol.iterator]();!(r=(d=h.next()).done);r=!0){var f=d.value,p=f.toUpperCase();if(o[f])e["scroll".concat(p,"State")]=l;else{var b=~~(i[f]*(1-e.damping)),m=b-i[f];0===m?(o[f]=!0,e["scroll".concat(p,"State")]=l):(e["scroll".concat(p,"State")]=s,i[f]=b,e["scroll".concat(p)]+=m),e["minScroll".concat(p,"WithBounce")]>e["scroll".concat(p)]?(e["scroll".concat(p)]=e["minScroll".concat(p,"WithBounce")],o[f]=!0):e["maxScroll".concat(p,"WithBounce")]<e["scroll".concat(p)]&&(e["scroll".concat(p)]=e["maxScroll".concat(p,"WithBounce")],o[f]=!0)}}}catch(v){a=!0,c=v}finally{try{r||null==h.return||h.return()}finally{if(a)throw c}}o.x&&(e.scrollXState=l,u!==e.bounceXState&&e.snapToEdge("x")),o.y&&(e.scrollYState=l,u!==e.bounceYState&&e.snapToEdge("y")),o.x&&o.y?(e.$emit("scroll-end",e.scrollData),e.$emit("after-scroll",e.scrollData)):e.rafId=D()(t)};r()},_scrollTo:function(t){var e=this,o=t.top,n=t.left,i=t.callback,r=void 0===i?function(){}:i,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300,c=Date.now(),d={X:n,Y:o},u={},h={},f=[void 0!==o&&"Y",void 0!==n&&"X"].filter((function(t){return!!t})),p=!0,b=!1,m=void 0;try{for(var v,w=f[Symbol.iterator]();!(p=(v=w.next()).done);p=!0){var x=v.value;u[x]=this["scroll".concat(x)],h[x]=d[x]-u[x],this["scroll".concat(x,"State")]=h[x]?s:l}}catch(y){b=!0,m=y}finally{try{p||null==w.return||w.return()}finally{if(b)throw m}}if(0!==f.length){var g=function t(){var o=Date.now()-c,n=e.easeFunction(Math.min(1,o/a)),i=!0,s=!1,d=void 0;try{for(var p,b=f[Symbol.iterator]();!(i=(p=b.next()).done);i=!0){var m=p.value;e["scroll".concat(m)]=Math.ceil(u[m]+h[m]*n)}}catch(y){s=!0,d=y}finally{try{i||null==b.return||b.return()}finally{if(s)throw d}}if(o<=a)e.scrollToRafId=D()(t);else{var v=!0,w=!1,x=void 0;try{for(var g,S=f[Symbol.iterator]();!(v=(g=S.next()).done);v=!0){var Y=g.value;h[Y]&&(e["scroll".concat(Y,"State")]=l)}}catch(y){w=!0,x=y}finally{try{v||null==S.return||S.return()}finally{if(w)throw x}}r()}};this.scrollToRafId=D()(g)}},scrollTo:function(t){var e=this,o=t.top,n=t.left,i=t.callback,r=void 0===i?function(){}:i,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300;this.$emit("before-scroll",this.scrollData),this.$emit("scroll-start",this.scrollData),this._scrollTo({top:o,left:n,callback:function(){e.$emit("scroll-end",e.scrollData),r()}},a)},snapToEdge:function(t){var e=this,o={x:void 0,y:void 0},n=void 0===t?["x","y"]:[t];n.forEach((function(t){var n=t.toUpperCase();e["minScroll".concat(n)]>e["scroll".concat(n)]?(e["".concat("x"===t?"left":"top","BounceState")]=u,o[t]=e["minScroll".concat(n)]):e["maxScroll".concat(n)]<e["scroll".concat(n)]&&(e["".concat("x"===t?"right":"bottom","BounceState")]=u,o[t]=e["maxScroll".concat(n)])})),void 0===o.x&&void 0===o.y||this._scrollTo({top:o.y,left:o.x,callback:function(){g.forEach((function(t){e["".concat(t,"BounceState")]=l}))}},this.bounceTime)}}},P=z,R=(o("9641"),Object(N["a"])(P,X,_,!1,null,null,null)),E=R.exports,I={name:"App",components:{AnyScroll:E},data:function(){return{data:[],height:"80vh",width:360,bounceDistance:150,overflowX:!1,overflowY:!1,isShowXBar:!0,isShowYBar:!0,scrollTop:0,scrollLeft:0,bounceState:{top:l,left:l,right:l,bottom:l},scrollState:{x:l,y:l}}},mounted:function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(){var e,o,n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("db.json");case 2:return e=t.sent,t.next=5,e.json();case 5:o=t.sent,n=o.data,this.data=n.slice(0,100),this.$nextTick(),this.$refs.scroll.updateSize();case 10:case"end":return t.stop()}}),t,this)})));function e(){return t.apply(this,arguments)}return e}(),methods:{scrollHandler:function(t){var e=t.scrollTop,o=t.scrollLeft;this.scrollLeft=o,this.scrollTop=e},scrollUp:function(){this.$refs.scroll.decelerate({speedX:0,speedY:-1})},scrollDown:function(){this.$refs.scroll.decelerate({speedX:0,speedY:1})},scrollLeftHandler:function(){this.$refs.scroll.decelerate({speedX:1,speedY:0})},scrollRightHandler:function(){this.$refs.scroll.decelerate({speedX:-1,speedY:0})},reset:function(){this.$refs.scroll.scrollTo({top:0,left:0})},test:function(t){var e=document,o=e.body;o.appendChild(this.$refs.scroll.$el)}}},U=I,F=(o("5c0b"),Object(N["a"])(U,i,r,!1,null,null,null)),J=F.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(J)}}).$mount("#app")},"5c0b":function(t,e,o){"use strict";var n=o("cc53"),i=o.n(n);i.a},"843d":function(t,e,o){e=t.exports=o("690e")(!1),e.push([t.i,".any-scroll-view{position:relative;width:100%;height:100%;overflow:hidden}.any-scroll-view__top{position:absolute;top:0;left:0;z-index:4;width:100%}.any-scroll-view__upper{position:absolute;top:0;left:0;z-index:3;width:100%}.any-scroll-view__under{position:absolute;top:0;left:0;z-index:1;width:100%}.any-scroll-view__bottom{position:absolute;bottom:0;left:0;z-index:4;width:100%}.any-scroll-view__content{position:absolute;z-index:2;width:100%;height:100%}",""])},9641:function(t,e,o){"use strict";var n=o("d39c"),i=o.n(n);i.a},cc53:function(t,e,o){var n=o("001a");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=o("85cb").default;i("b933d192",n,!0,{sourceMap:!1,shadowMode:!1})},d39c:function(t,e,o){var n=o("843d");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=o("85cb").default;i("71bfcaa9",n,!0,{sourceMap:!1,shadowMode:!1})}});
//# sourceMappingURL=app.d7101181.js.map