(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AnyScroll = factory());
})(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var r$2=function(){function r(){this.__map={};}return r.prototype.beforeEach=function(t){this.__interceptor=t;},r.prototype.on=function(r,i){var e,o,n=Array.isArray(r)?r:[r];try{for(var a=__values(n),_=a.next();!_.done;_=a.next()){var f=_.value;this.__map[f]=this.__map[f]||[];var p=this.__map[f];p&&p.push(i);}}catch(t){e={error:t};}finally{try{_&&!_.done&&(o=a.return)&&o.call(a);}finally{if(e)throw e.error}}return this},r.prototype.emit=function(t,r){var i=this;void 0!==this.__interceptor?this.__interceptor(this,(function(){i.__emit(t,r);})):this.__emit(t,r);},r.prototype.__emit=function(r,i){var e,o,n=this.__map[r];if(Array.isArray(n)&&(null==n?void 0:n.length))try{for(var a=__values(n),_=a.next();!_.done;_=a.next()){(0,_.value)(i);}}catch(t){e={error:t};}finally{try{_&&!_.done&&(o=a.return)&&o.call(a);}finally{if(e)throw e.error}}this.event=i;},r.prototype.off=function(t,r){var i=this.__map[t];if(void 0!==i)if(void 0===r)delete this.__map[t];else {var e=i.findIndex((function(t){return t===r}));i.splice(e,1);}},r.prototype.destroy=function(){this.__map={};},r}();var AnyEvent = r$2;

    var e$2=Object.prototype.toString;function E$2(t){return "[object Function]"===e$2.call(t)}var n,o$2,c$2="clientX",u$2="clientY",r$1=16,L$1="start",D="move",a$3="cancel",i$3="end",S="computed",A="left",C="right",N="up",O="down",m$1="touchstart",s$2="touchmove",I="touchend",v$1="touchcancel",T$1="mouseup",f$2="mousemove",R="mousedown";!function(t){t[t.POSSIBLE=0]="POSSIBLE",t[t.RECOGNIZED=1]="RECOGNIZED",t[t.FAILED=2]="FAILED",t[t.CANCELLED=3]="CANCELLED",t[t.START=4]="START",t[t.MOVE=5]="MOVE",t[t.END=1]="END";}(n||(n={}));var M$1=((o$2={})[n.START]="start",o$2[n.MOVE]="move",o$2[n.END]="end",o$2[n.CANCELLED]="cancel",o$2);function V(t){return M$1[t]}function h$2(t,e,E){var o,c,u,r,L,D,a,i={1:(o={},o[n.POSSIBLE]=(c={},c.move=n.START,c),o[n.START]=(u={},u.move=n.MOVE,u.end=n.END,u.cancel=n.CANCELLED,u),o[n.MOVE]=(r={},r.move=n.MOVE,r.end=n.END,r.cancel=n.CANCELLED,r),o),0:(L={},L[n.START]=(D={},D.move=n.FAILED,D.end=n.END,D.cancel=n.CANCELLED,D),L[n.MOVE]=(a={},a.start=n.FAILED,a.move=n.FAILED,a.end=n.END,a.cancel=n.CANCELLED,a),L)}[Number(t)][e];return void 0!==i&&i[E]||n.POSSIBLE}function p$2(t){[n.RECOGNIZED,n.CANCELLED,n.FAILED].includes(t.state)&&(t.state=n.POSSIBLE);}function B(t){return [n.START,n.MOVE].includes(t)}function F(t){if(t.disabled)return t.state=n.POSSIBLE,!0}function P(e,E){return __assign(__assign(__assign({},e),E),{state:n.POSSIBLE,disabled:!1})}function b$1(t){return Math.round(100*t)/100}

    function E$1(){var e,n,r,i,c=0;return function(s){if(e=n,void 0!==s){var p=function(t,e){var n=t.phase,r=t.points,i=t.changedPoints,c=t.nativeEvent,s=r.length,p=L$1===n,v=i$3===n&&0===s||a$3===n,f=Date.now(),l=b(r)||b(i),h=l.x,d=l.y,g=c.currentTarget;return Object.assign(t,{id:e,x:h,y:d,timestamp:f,isStart:p,isEnd:v,pointLength:s,currentTarget:g,getOffset:function(t){void 0===t&&(t=g);var e=t.getBoundingClientRect();return {x:h-Math.round(e.left),y:d-Math.round(e.top)}}})}(s,c=Number.MAX_SAFE_INTEGER>c?++c:1);n=p;var v=p.isStart,f=p.pointLength;return v&&(r=p,e=void 0,i=1<f?p:void 0),__assign(__assign({},p),{prevInput:e,startMultiInput:i,startInput:r})}}}function b(t){var e=t.length;if(0<e){if(1===e){var n=t[0],r=n.clientX,i=n.clientY;return {x:Math.round(r),y:Math.round(i)}}var o=t.reduce((function(t,e){return t.x+=e[c$2],t.y+=e[u$2],t}),{x:0,y:0});return {x:Math.round(o.x/e),y:Math.round(o.y/e)}}}function L(t,n,r,i){r.target,r.currentTarget,r.type;var o,a=__rest(r,["target","currentTarget","type"]);return document.createEvent?(o=document.createEvent("HTMLEvents")).initEvent(t,null==i?void 0:i.bubbles,null==i?void 0:i.cancelable):o=new Event(t,i),Object.assign(o,a,{match:function(){return r.targets&&0<r.targets.length&&r.targets.every((function(t){return o.currentTarget.contains(t)}))}}),n.dispatchEvent(o)}var x=[m$1,s$2,I,v$1];var T={domEvents:{bubbles:!0,cancelable:!0},preventDefault:function(t){if(t.target&&"tagName"in t.target){var e=t.target.tagName;return !/^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/.test(e)}return !1}},w=function(e){function i(n,r){var i,u=e.call(this)||this;u.__computeFunctionList=[],u.__computeFunctionCreatorList=[],u.__pluginContexts=[],u.el=n,u.__options=__assign(__assign({},T),r);var c,s,h,_,b=function(t){var e=E$1();return function(n){var r=[],i=[];Array.from(n.touches).forEach((function(e){var n=e.clientX,o=e.clientY,a=e.target;(null==t?void 0:t.contains(a))&&(r.push(a),i.push({clientX:n,clientY:o,target:a}));}));var o=Array.from(n.changedTouches).map((function(t){return {clientX:t.clientX,clientY:t.clientY,target:t.target}}));return e({phase:n.type.replace("touch",""),changedPoints:o,points:i,nativeEvent:n,target:n.target,targets:r})}}(u.el),L=(s=!1,h=null,_=E$1(),function(t){var e,n=t.clientX,r=t.clientY,i=t.type,u=t.button,d=t.target,g=[{clientX:n,clientY:r,target:d}];if(R===i&&0===u)h=d,s=!0,e=L$1;else {if(!s)return;f$2===i?e=D:T$1===i&&(g=[],e=i$3,s=!1);}var m=c||[{clientX:n,clientY:r,target:d}];if(c=[{clientX:n,clientY:r,target:d}],void 0!==e)return _({phase:e,changedPoints:m,points:g,target:h,targets:[h],nativeEvent:t})});if(u.__inputCreatorMap=((i={})[m$1]=b,i[s$2]=b,i[I]=b,i[v$1]=b,i[R]=L,i[f$2]=L,i[T$1]=L,i),void 0!==n){n.style.webkitTapHighlightColor="rgba(0,0,0,0)";var w=!1;try{var C={};Object.defineProperty(C,"passive",{get:function(){w=!0;}}),window.addEventListener("_",(function(){}),C);}catch(t){}u.on("u",function(t,e,n){return x.forEach((function(r){t.addEventListener(r,e,n);})),t.addEventListener(R,e,n),window.addEventListener(f$2,e,n),window.addEventListener(T$1,e,n),function(){x.forEach((function(n){t.removeEventListener(n,e);})),t.removeEventListener(R,e,n),window.removeEventListener(f$2,e,n),window.removeEventListener(T$1,e,n);}}(n,u.catchEvent.bind(u),!(!1!==u.__options.preventDefault||!w)&&{passive:!0}));}return u}return __extends(i,e),i.prototype.use=function(t,e){this.__pluginContexts.push(t(this,e));},i.prototype.catchEvent=function(e){var n=this.__inputCreatorMap[e.type](e);if(void 0!==n){var r=function(){return e.preventDefault()};((function(t,e){var n=e.preventDefault;return E$2(n)?n(t):!!n}))(e,this.__options)&&r(),this.emit("input",n),this.emit2("at:"+n.phase,n,{});var i={};this.__computeFunctionList.forEach((function(t){var e=t(n,i);if(void 0!==e)for(var r in e)i[r]=e[r];})),this.emit(S,__assign(__assign(__assign({},n),i),{stopPropagation:function(){return e.stopPropagation()},stopImmediatePropagation:function(){return e.stopImmediatePropagation()},preventDefault:r}));}},i.prototype.compute=function(t,e){var n,i;try{for(var o=__values(t),a=o.next();!a.done;a=o.next()){var u=a.value;this.__computeFunctionCreatorList.includes(u)||(this.__computeFunctionCreatorList.push(u),this.__computeFunctionList.push(u()));}}catch(t){n={error:t};}finally{try{a&&!a.done&&(i=o.return)&&i.call(o);}finally{if(n)throw n.error}}this.on(S,e);},i.prototype.beforeEach=function(n){var r=this;e.prototype.beforeEach.call(this,(function(e,i){var o;void 0===(null===(o=e.c)||void 0===o?void 0:o.name)?i():n(__assign(__assign({},e.c),{event:r.event}),i);}));},i.prototype.get=function(t){return this.__pluginContexts.find((function(e){return t===e.name}))},i.prototype.set=function(e){this.__options=__assign(__assign({},this.__options),e);},i.prototype.emit2=function(e,n,r){this.c=r,this.emit(e,__assign(__assign({},n),{type:e})),this.emit("at:after",__assign(__assign({},n),{name:e}));var i=n.target,o=this.__options.domEvents;o&&void 0!==this.el&&i&&(L(e,i,n,o),L("at:after",i,__assign(__assign({},n),{name:e}),o));},i.prototype.destroy=function(){this.emit("u"),e.prototype.destroy.call(this);},i}(AnyEvent);var r = w;

    var a$2=function(r){return Math.sqrt(r.x*r.x+r.y*r.y)},o$1=function(r,t){return r.x*t.x+r.y*t.y},e$1=function(r,t){var n=a$2(r)*a$2(t);if(0===n)return 0;var u=o$1(r,t)/n;return u>1&&(u=1),Math.acos(u)},c$1=function(r,t){return r.x*t.y-t.x*r.y},f$1=function(r){return r/Math.PI*180},i$2=function(r,t){var n=e$1(r,t);return c$1(r,t)>0&&(n*=-1),f$1(n)},h$1=function(a,o){return Math.abs(a)>=Math.abs(o)?0<a?C:A:0<o?O:N};

    function s$1(){var n=0,r=0;return function(a,e){var o=e.prevVecotr,i=e.startVecotr,u=e.activeVecotr;return u&&(r=Math.round(i$2(u,o)),n=Math.round(i$2(u,i))),{angle:n,deltaAngle:r}}}function v(){return function(t){var r=t.prevInput,a=0,e=0,o=0;if(void 0!==r&&(a=t.x-r.x,e=t.y-r.y,0!==a||0!==e)){var i=Math.sqrt(Math.pow(a,2)+Math.pow(e,2));o=Math.round(f$1(Math.acos(Math.abs(a)/i)));}return {deltaX:a,deltaY:e,deltaXYAngle:o}}}function d(){var t,n=0,c=0,p=0,s=0,v=0;return function(d){var h=d.phase,f=d.startInput;return L$1===h?(n=0,c=0,p=0,s=0,v=0):D===h&&(n=Math.round(d.points[0][c$2]-f.points[0][c$2]),c=Math.round(d.points[0][u$2]-f.points[0][u$2]),p=Math.abs(n),s=Math.abs(c),v=Math.round(a$2({x:p,y:s})),t=h$1(n,c)),{displacementX:n,displacementY:c,distanceX:p,distanceY:s,distance:v,overallDirection:t}}}function h(){var t=1,n=1;return function(a,e){var o=e.prevVecotr,i=e.startVecotr,u=e.activeVecotr;return u&&(t=b$1(a$2(u)/a$2(o)),n=b$1(a$2(u)/a$2(i))),{scale:n,deltaScale:t}}}function f(){var t,n,r=0,e=0,o=0,i=0;return function(u){if(void 0!==u){n=n||u.startInput;var c=u.timestamp-n.timestamp;if(r$1<c){var s=u.x-n.x,v=u.y-n.y;o=Math.round(s/c*100)/100,i=Math.round(v/c*100)/100,r=Math.abs(o),e=Math.abs(i),t=h$1(s,v)||t,n=u;}}return {velocityX:r,velocityY:e,speedX:o,speedY:i,direction:t}}}function M(){var t=0;return function(n){var r=n.phase;return L$1===r&&(t=n.pointLength),{maxPointLength:t}}}function l(t){return {x:t.points[1][c$2]-t.points[0][c$2],y:t.points[1][u$2]-t.points[0][u$2]}}function m(){var t,n,r;return function(a){var e=a.prevInput,o=a.startMultiInput;return void 0!==o&&void 0!==e&&a.id!==o.id&&1<e.pointLength&&1<a.pointLength&&(t=l(o),n=l(e),r=l(a)),{startVecotr:t,prevVecotr:n,activeVecotr:r}}}

    var o={name:"tap",pointLength:1,tapTimes:1,waitNextTapTime:300,maxDistance:2,maxDistanceFromPrevTap:9,maxPressTime:250};function t(p,s){var u,c,x,f=P(o,s),T=0;function v(){T=0,u=void 0,c=void 0;}return p.compute([d,M],(function(t){if(!F(f)){var r,m,o,s,h=t.phase,y=t.x,d=t.y;if(i$3===h)f.state=n.POSSIBLE,r=t.startInput,m=t.pointLength,o=t.timestamp-r.timestamp,s=t.distance,t.maxPointLength===f.pointLength&&0===m&&f.maxDistance>=s&&f.maxPressTime>o?(clearTimeout(x),function(t,e){if(void 0!==u){var a=a$2({x:t.x-u.x,y:t.y-u.y});return u=t,e.maxDistanceFromPrevTap>=a}return u=t,!0}({x:y,y:d},f)&&function(t){var e=performance.now();if(void 0===c)return c=e,!0;var a=e-c;return c=e,a<t}(f.waitNextTapTime)?T++:T=1,0==T%f.tapTimes?(f.state=n.RECOGNIZED,p.emit2(f.name,t,f),v()):x=setTimeout((function(){f.state=n.FAILED,v();}),f.waitNextTapTime)):(v(),f.state=n.FAILED);}})),f}

    var s={name:"pan",threshold:10,pointLength:1};function E(c,u){var d$1=P(s,u);return c.compute([f,d,v],(function(t){if(p$2(d$1),!F(d$1)){var h,p,m,s,u,f=(h=t.pointLength,p=t.distance,m=t.direction,s=t.phase,u=d$1.state,(B(u)||d$1.threshold<=p)&&d$1.pointLength===h&&void 0!==m||B(u)&&i$3===s);if(d$1.state=h$2(f,d$1.state,t.phase),f){var v=d$1.name;c.emit2(v,t,d$1),c.emit2(v+V(d$1.state),t,d$1);}}})),d$1}

    var a={name:"swipe",threshold:10,velocity:.3,pointLength:1};function a$1(c,h){var m=P(a,h);return c.compute([d,f,M],(function(t){if(m.state=n.POSSIBLE,!m.disabled&&function(){if(i$3!==t.phase)return !1;var e=t.velocityX,o=t.velocityY,i=t.distance;return t.maxPointLength===m.pointLength&&0===t.points.length&&m.threshold<i&&m.velocity<Math.max(e,o)}()){var o=m.name;m.state=n.RECOGNIZED,c.emit2(o,t,m),c.emit2(o+t.direction,t,m);}})),m}

    var u$1={name:"press",pointLength:1,maxDistance:9,minPressTime:251};function p$1(c,p){var f=P(u$1,p),h=0;return c.compute([d],(function(e){if(!F(f)){var o,u=e.phase,p=e.startInput,E=e.pointLength;if(L$1===u&&f.pointLength===E)p$2(f),clearTimeout(h),h=setTimeout((function(){f.state=n.RECOGNIZED,c.emit2(f.name,e,f);}),f.minPressTime);else if(i$3===u&&n.RECOGNIZED===f.state)c.emit2(""+f.name+N,e,f);else if(n.RECOGNIZED!==f.state){var l=e.timestamp-p.timestamp;(!((o=e.distance)&&f.maxDistance>o)||f.minPressTime>l&&[i$3,a$3].includes(u))&&(clearTimeout(h),f.state=n.FAILED);}}})),f}

    var c={name:"pinch",threshold:0,pointLength:2};function e(m$1,u){var d=P(c,u);return m$1.compute([m,h],(function(t){if(p$2(d),!F(d)){var s,p,c,u,l=(s=t.pointLength,p=t.scale,c=t.deltaScale,u=t.phase,d.pointLength===s&&(void 0!==p&&void 0!==c&&d.threshold<Math.abs(p-1)||B(d.state))||B(d.state)&&[i$3,a$3].includes(u));d.state=h$2(l,d.state,t.phase);var v=d.name;l&&m$1.emit2(v,t,d);var f=V(d.state);f&&m$1.emit2(v+f,t,d);}})),d}

    var p={name:"rotate",threshold:0,pointLength:2};function i$1(u,c){var f=P(p,c);return u.compute([m,s$1],(function(t){if(!F(f)){p$2(f);var i,m,p,c=(i=t.pointLength,m=t.angle,p=t.phase,f.pointLength===i&&(f.threshold<Math.abs(m)||B(f.state))||B(f.state)&&[i$3,a$3].includes(p));f.state=h$2(c,f.state,t.phase);var d=f.name;c&&u.emit2(d,t,f);var l=V(f.state);l&&u.emit2(d+l,t,f);}})),f}

    var u=function(r){function u(o,n){var u=r.call(this,o,n)||this;return u.use(t),u.use(E),u.use(a$1),u.use(p$1),u.use(e),u.use(i$1),u}return __extends(u,r),u.version="2.0.0-alpha.3",u.STATE_POSSIBLE=n.POSSIBLE,u.STATE_START=n.START,u.STATE_MOVE=n.MOVE,u.STATE_END=n.END,u.STATE_CANCELLED=n.CANCELLED,u.STATE_FAILED=n.FAILED,u.STATE_RECOGNIZED=n.RECOGNIZED,u.tap=t,u.pan=E,u.swipe=a$1,u.press=p$1,u.rotate=i$1,u.pinch=e,u}(r);var AnyTouch = u;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    var raf$2 = {exports: {}};

    var performanceNow = {exports: {}};

    // Generated by CoffeeScript 1.12.2
    (function() {
      var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

      if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
        performanceNow.exports = function() {
          return performance.now();
        };
      } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
        performanceNow.exports = function() {
          return (getNanoSeconds() - nodeLoadTime) / 1e6;
        };
        hrtime = process.hrtime;
        getNanoSeconds = function() {
          var hr;
          hr = hrtime();
          return hr[0] * 1e9 + hr[1];
        };
        moduleLoadTime = getNanoSeconds();
        upTime = process.uptime() * 1e9;
        nodeLoadTime = moduleLoadTime - upTime;
      } else if (Date.now) {
        performanceNow.exports = function() {
          return Date.now() - loadTime;
        };
        loadTime = Date.now();
      } else {
        performanceNow.exports = function() {
          return new Date().getTime() - loadTime;
        };
        loadTime = new Date().getTime();
      }

    }).call(commonjsGlobal);

    var now = performanceNow.exports
      , root$2 = typeof window === 'undefined' ? commonjsGlobal : window
      , vendors = ['moz', 'webkit']
      , suffix = 'AnimationFrame'
      , raf = root$2['request' + suffix]
      , caf = root$2['cancel' + suffix] || root$2['cancelRequest' + suffix];

    for(var i = 0; !raf && i < vendors.length; i++) {
      raf = root$2[vendors[i] + 'Request' + suffix];
      caf = root$2[vendors[i] + 'Cancel' + suffix]
          || root$2[vendors[i] + 'CancelRequest' + suffix];
    }

    // Some versions of FF have rAF but not cAF
    if(!raf || !caf) {
      var last = 0
        , id = 0
        , queue = []
        , frameDuration = 1000 / 60;

      raf = function(callback) {
        if(queue.length === 0) {
          var _now = now()
            , next = Math.max(0, frameDuration - (_now - last));
          last = next + _now;
          setTimeout(function() {
            var cp = queue.slice(0);
            // Clear queue here to prevent
            // callbacks from appending listeners
            // to the current frame's queue
            queue.length = 0;
            for(var i = 0; i < cp.length; i++) {
              if(!cp[i].cancelled) {
                try{
                  cp[i].callback(last);
                } catch(e) {
                  setTimeout(function() { throw e }, 0);
                }
              }
            }
          }, Math.round(next));
        }
        queue.push({
          handle: ++id,
          callback: callback,
          cancelled: false
        });
        return id
      };

      caf = function(handle) {
        for(var i = 0; i < queue.length; i++) {
          if(queue[i].handle === handle) {
            queue[i].cancelled = true;
          }
        }
      };
    }

    raf$2.exports = function(fn) {
      // Wrap in a new function to prevent
      // `cancel` potentially being assigned
      // to the native rAF function
      return raf.call(root$2, fn)
    };
    raf$2.exports.cancel = function() {
      caf.apply(root$2, arguments);
    };
    raf$2.exports.polyfill = function(object) {
      if (!object) {
        object = root$2;
      }
      object.requestAnimationFrame = raf;
      object.cancelAnimationFrame = caf;
    };

    var raf$1 = raf$2.exports;

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */

    function baseClamp$1(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    var _baseClamp = baseClamp$1;

    /** Used to match a single whitespace character. */

    var reWhitespace = /\s/;

    /**
     * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
     * character of `string`.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {number} Returns the index of the last non-whitespace character.
     */
    function trimmedEndIndex$1(string) {
      var index = string.length;

      while (index-- && reWhitespace.test(string.charAt(index))) {}
      return index;
    }

    var _trimmedEndIndex = trimmedEndIndex$1;

    var trimmedEndIndex = _trimmedEndIndex;

    /** Used to match leading whitespace. */
    var reTrimStart = /^\s+/;

    /**
     * The base implementation of `_.trim`.
     *
     * @private
     * @param {string} string The string to trim.
     * @returns {string} Returns the trimmed string.
     */
    function baseTrim$1(string) {
      return string
        ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
        : string;
    }

    var _baseTrim = baseTrim$1;

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */

    function isObject$1(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject$1;

    /** Detect free variable `global` from Node.js. */

    var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal$1;

    var freeGlobal = _freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root$1 = freeGlobal || freeSelf || Function('return this')();

    var _root = root$1;

    var root = _root;

    /** Built-in value references. */
    var Symbol$3 = root.Symbol;

    var _Symbol = Symbol$3;

    var Symbol$2 = _Symbol;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto$1.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag$1(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag$1;

    /** Used for built-in method references. */

    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString$1(value) {
      return nativeObjectToString.call(value);
    }

    var _objectToString = objectToString$1;

    var Symbol$1 = _Symbol,
        getRawTag = _getRawTag,
        objectToString = _objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag$1(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    var _baseGetTag = baseGetTag$1;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */

    function isObjectLike$1(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike$1;

    var baseGetTag = _baseGetTag,
        isObjectLike = isObjectLike_1;

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol$1(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    var isSymbol_1 = isSymbol$1;

    var baseTrim = _baseTrim,
        isObject = isObject_1,
        isSymbol = isSymbol_1;

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber$3(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    var toNumber_1 = toNumber$3;

    var baseClamp = _baseClamp,
        toNumber$2 = toNumber_1;

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber$2(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber$2(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber$2(number), lower, upper);
    }

    var clamp_1 = clamp;

    /* Built-in method references for those with the same name as other `lodash` methods. */

    var nativeMax = Math.max,
        nativeMin = Math.min;

    /**
     * The base implementation of `_.inRange` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to check.
     * @param {number} start The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     */
    function baseInRange$1(number, start, end) {
      return number >= nativeMin(start, end) && number < nativeMax(start, end);
    }

    var _baseInRange = baseInRange$1;

    var toNumber$1 = toNumber_1;

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0,
        MAX_INTEGER = 1.7976931348623157e+308;

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite$1(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber$1(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    var toFinite_1 = toFinite$1;

    var baseInRange = _baseInRange,
        toFinite = toFinite_1,
        toNumber = toNumber_1;

    /**
     * Checks if `n` is between `start` and up to, but not including, `end`. If
     * `end` is not specified, it's set to `start` with `start` then set to `0`.
     * If `start` is greater than `end` the params are swapped to support
     * negative ranges.
     *
     * @static
     * @memberOf _
     * @since 3.3.0
     * @category Number
     * @param {number} number The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
     * @see _.range, _.rangeRight
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     *
     * _.inRange(-3, -2, -6);
     * // => true
     */
    function inRange(number, start, end) {
      start = toFinite(start);
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      number = toNumber(number);
      return baseInRange(number, start, end);
    }

    var inRange_1 = inRange;

    function xY2Tuple(xy, defaultXY) {
        if ('x' in xy || 'y' in xy) {
            return [xy.x || defaultXY[0], xy.y || defaultXY[1]];
        }
        return runTwice(function (i) { return xy[i] || defaultXY[i]; });
    }
    var Axis;
    (function (Axis) {
        Axis["X"] = "x";
        Axis["Y"] = "y";
    })(Axis || (Axis = {}));
    var AxisList = [Axis.X, Axis.Y];
    function setStyle(el, styles) {
        for (var key in styles) {
            el.style[key] = styles[key] || '';
        }
    }
    function render(el, _a) {
        var _b = __read(_a, 2), x = _b[0], y = _b[1];
        setStyle(el, { transform: "translate3d(" + x + "px, " + y + "px,0)" });
    }
    function createDOMDiv(className) {
        var _a;
        var div = document.createElement("div");
        if (className) {
            (_a = div.classList).add.apply(_a, __spread(className));
        }
        return div;
    }
    function changeOpacity(el, opacity) {
        if (opacity === void 0) { opacity = 1; }
        setStyle(el, { opacity: String(opacity) });
    }
    function changeDOMVisible(el, visible) {
        if (visible === void 0) { visible = true; }
        var NONE = 'none';
        if (visible) {
            if (NONE === el.style.display) {
                setStyle(el, { display: '' });
            }
        }
        else {
            setStyle(el, { display: NONE });
        }
    }
    function easing(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    function runTwice(callback) {
        return [callback(0), callback(1)];
    }
    function tween(from, to, duration, easingFunction) {
        if (easingFunction === void 0) { easingFunction = easing; }
        var _from = __spread(from);
        var _to = __spread(to);
        var startTime = Date.now();
        var rafId = -1;
        var _onDone = function () { };
        var valueDiff = _to.map(function (n, i) { return n - _from[i]; });
        function run(onChange) {
            rafId = raf$1(function () {
                var timeDiff = Date.now() - startTime;
                var timeProgress = timeDiff / duration;
                var valueProgress = easingFunction(timeProgress);
                if (1 > timeProgress) {
                    var currentValue = _from.map(function (n, i) { return n + valueDiff[i] * valueProgress; });
                    onChange(currentValue);
                    run(onChange);
                }
                else {
                    onChange(_to);
                    _onDone();
                }
            });
        }
        function onDone(cb) {
            _onDone = cb;
        }
        function stop() {
            raf$1.cancel(rafId);
        }
        return [run, stop, onDone];
    }
    function damp(value, dist, damping) {
        if (damping === void 0) { damping = 0.1; }
        var diff = dist - value;
        if (0.1 < Math.abs(diff)) {
            return dist - (((1 - damping) * diff) | 0);
        }
        return dist;
    }

    var SCROLL_END_DELAY = 16;
    var TYPE_BEFORE_DESTROY$1 = 'beforeDestroy';
    var TYPE_BEFORE_UPDATED = 'beforeUpdate';
    var TYPE_UPDATED$1 = 'updated';
    var TYPE_SCROLL = 'scroll';
    var TYPE_SCROLL_END = 'scroll-end';

    var ResizeObserver$1 = window.ResizeObserver, MutationObserver = window.MutationObserver;
    var Content$1 = (function (_super) {
        __extends(Content, _super);
        function Content(contentEl, wrapRef) {
            var _this = _super.call(this) || this;
            _this.xy = [0, 0];
            _this.minXY = [0, 0];
            _this.maxXY = [0, 0];
            _this.wrapSize = [0, 0];
            _this.contentSize = [0, 0];
            _this.targets = [];
            _this.isScrolling = false;
            _this.__scrollEndTimeId = -1;
            _this.__dampScrollRafId = -1;
            _this.__stopScroll = function () { };
            _this.el = contentEl;
            _this.wrapRef = wrapRef;
            var options = wrapRef.options;
            _this.__options = options;
            setStyle(contentEl, { position: 'absolute' });
            wrapRef.on(TYPE_BEFORE_UPDATED, function () {
                _this.update();
            });
            if (ResizeObserver$1) {
                var ro_1 = new ResizeObserver$1(function () {
                    _this.update();
                });
                ro_1.observe(contentEl);
                _this.on(TYPE_BEFORE_DESTROY$1, function () {
                    ro_1.disconnect();
                });
            }
            else if (MutationObserver) {
                _this.update();
                var observer_1 = new MutationObserver(function () {
                    _this.update();
                });
                observer_1.observe(contentEl, {
                    childList: true,
                    subtree: true,
                });
                _this.on(TYPE_BEFORE_DESTROY$1, function () {
                    observer_1.disconnect();
                });
            }
            return _this;
        }
        Content.prototype.set = function (options) {
            this.__options = __assign(__assign({}, this.__options), options);
            this.update();
        };
        Content.prototype.update = function () {
            var el = this.el;
            var offsetWidth = el.offsetWidth, offsetHeight = el.offsetHeight, clientWidth = el.clientWidth, clientHeight = el.clientHeight, scrollWidth = el.scrollWidth, scrollHeight = el.scrollHeight;
            this.wrapSize = [this.wrapRef.size[0], this.wrapRef.size[1]];
            this.contentSize = [offsetWidth - clientWidth + scrollWidth, offsetHeight - clientHeight + scrollHeight];
            this.maxXY = this.__options.maxXY
                ? this.__options.maxXY(this)
                : [
                    Math.max(0, this.contentSize[0] - this.wrapSize[0]),
                    Math.max(0, this.contentSize[1] - this.wrapSize[1]),
                ];
            this.minXY = this.__options.minXY ? this.__options.minXY(this) : [0, 0];
            this.emit(TYPE_UPDATED$1, this);
        };
        Content.prototype.stop = function () {
            var _this = this;
            if (this.isScrolling && this.xy.every(function (v, i) { return inRange_1(v, _this.minXY[i], _this.maxXY[i]); })) {
                this.emit(TYPE_SCROLL_END, this.xy);
            }
            this.isScrolling = false;
            raf$1.cancel(this.__dampScrollRafId);
            this.__stopScroll();
        };
        Content.prototype.snap = function () {
            var _this = this;
            var xy = runTwice(function (i) { return clamp_1(_this.xy[i], _this.minXY[i], _this.maxXY[i]); });
            this.dampScroll(xy);
        };
        Content.prototype.moveTo = function (distXY) {
            var _this = this;
            var _a = this.__options, allow = _a.allow, overflowDistance = _a.overflowDistance;
            if (!allow.includes(true))
                return this.xy;
            clearTimeout(this.__scrollEndTimeId);
            var tupleXY = xY2Tuple(distXY, this.xy);
            var nextXY = runTwice(function (i) {
                if (allow[i] && void 0 !== tupleXY[i]) {
                    return clamp_1(tupleXY[i], _this.minXY[i] - overflowDistance, _this.maxXY[i] + overflowDistance);
                }
                return _this.xy[i];
            });
            var isChanged = this.xy.some(function (xOrY, i) { return xOrY !== nextXY[i]; });
            if (!isChanged)
                return this.xy;
            runTwice(function (i) { return (_this.xy[i] = nextXY[i]); });
            var _b = __read(this.xy, 2), x = _b[0], y = _b[1];
            var targets = this.targets;
            var target = targets[0];
            this.emit('scroll', { targets: targets, target: target, x: x, y: y });
            this.__options.render(this.el, [-this.xy[0], -this.xy[1]]);
            return this.xy;
        };
        Content.prototype.scrollTo = function (distXY, duration, easing) {
            var _this = this;
            if (duration === void 0) { duration = 1000; }
            var tupleXY = xY2Tuple(distXY, this.xy);
            var overflowDistance = this.__options.overflowDistance;
            this.stop();
            this.isScrolling = true;
            var realDist = runTwice(function (i) {
                return clamp_1(tupleXY[i], _this.minXY[i] - overflowDistance, _this.maxXY[i] + overflowDistance);
            });
            var _a = __read(tween(this.xy, realDist, duration, easing), 3), run = _a[0], stop = _a[1], done = _a[2];
            run(this.moveTo.bind(this));
            this.__stopScroll = stop;
            done(function () {
                _this.snap();
                _this.isScrolling = false;
            });
        };
        Content.prototype.scrollToElement = function (el, offset, duration, easingFunction) {
            var _this = this;
            if (offset === void 0) { offset = [0, 0]; }
            if (duration === void 0) { duration = 1000; }
            if (easingFunction === void 0) { easingFunction = easing; }
            var offsetTuple = xY2Tuple(offset, [0, 0]);
            console.log(offsetTuple);
            var rect = this.wrapRef.el.getBoundingClientRect();
            var _a = el.getBoundingClientRect(), x = _a.x, y = _a.y;
            var distXY = runTwice(function (i) { return _this.xy[i] + [x, y][i] - [rect.x, rect.y][i] + offsetTuple[i]; });
            this.scrollTo(distXY, duration, easingFunction);
        };
        Content.prototype.dampScroll = function (distXY, damping) {
            var _this = this;
            var tupleXY = xY2Tuple(distXY, this.xy);
            var _a = this.__options, overflowDistance = _a.overflowDistance, allow = _a.allow;
            var noScroll = runTwice(function (i) { return !allow[i] || tupleXY[i] === _this.xy[i]; }).every(function (isMoved) { return isMoved; });
            if (noScroll)
                return;
            raf$1.cancel(this.__dampScrollRafId);
            var _distXY = __spread(tupleXY);
            function _moveTo(context) {
                context.isScrolling = true;
                var xy = context.xy, minXY = context.minXY, maxXY = context.maxXY;
                var _nextXY = runTwice(function (i) {
                    if (!allow[i])
                        return xy[i];
                    var _nextValue = damp(context.xy[i], _distXY[i], damping);
                    if (_nextValue >= maxXY[i] + overflowDistance) {
                        _distXY[i] = maxXY[i];
                    }
                    else if (_nextValue <= minXY[i] - overflowDistance) {
                        _distXY[i] = minXY[i];
                    }
                    else {
                        if (_nextValue === _distXY[i]) {
                            if (xy[i] > maxXY[i]) {
                                _distXY[i] = maxXY[i];
                            }
                            else if (xy[i] < minXY[i]) {
                                _distXY[i] = minXY[i];
                            }
                        }
                        else {
                            return _nextValue;
                        }
                    }
                    return damp(context.xy[i], _distXY[i], damping);
                });
                context.moveTo(_nextXY);
                var _needScroll = runTwice(function (i) { return allow[i] && _distXY[i] !== _nextXY[i]; }).some(function (bool) { return bool; });
                if (_needScroll) {
                    context.__dampScrollRafId = raf$1(function () {
                        _moveTo(context);
                    });
                }
                else {
                    context.isScrolling = false;
                    context.emit('scroll-end', context.xy);
                }
            }
            _moveTo(this);
        };
        Content.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return Content;
    }(AnyEvent));

    var setTimeout$3 = window.setTimeout, ResizeObserver = window.ResizeObserver;
    var DEFAULT_OPTIONS = {
        overflowDistance: 100,
        damping: 0.1,
        allow: [true, true],
        render: render,
    };
    var Wrap$1 = (function (_super) {
        __extends(Wrap, _super);
        function Wrap(el, options) {
            var _this = _super.call(this) || this;
            _this.size = [0, 0];
            _this.targets = [];
            _this.__contentRefList = [];
            _this.el = el;
            _this.options = __assign(__assign({}, DEFAULT_OPTIONS), options);
            setStyle(el, {
                position: "relative",
                overflow: 'hidden',
            });
            Array.from(el.children).forEach(function (contentEl) {
                var contentRef = new Content$1(contentEl, _this);
                contentRef.on(TYPE_SCROLL, function (arg) {
                    _this.emit(TYPE_SCROLL, arg);
                });
                contentRef.on(TYPE_SCROLL_END, function (arg) {
                    _this.emit(TYPE_SCROLL_END, arg);
                });
                contentRef.on(TYPE_UPDATED$1, function (arg) {
                    _this.emit(TYPE_UPDATED$1, arg);
                });
                _this.on(TYPE_BEFORE_DESTROY$1, function () {
                    contentRef.destroy();
                });
                _this.__contentRefList.push(contentRef);
            });
            _this.__currentContentRef = _this.getContentRef();
            if (ResizeObserver) {
                var ro_1 = new ResizeObserver(_this.update.bind(_this));
                ro_1.observe(el);
                _this.on(TYPE_BEFORE_DESTROY$1, function () {
                    ro_1.disconnect();
                });
            }
            else {
                _this.update();
            }
            var at = new AnyTouch(el);
            _this.at = at;
            at.on(['panstart', 'panmove'], function (e) {
                var currentContentRef = _this.__currentContentRef;
                if (null !== currentContentRef) {
                    _this.targets = e.targets;
                    var deltaX = e.deltaX, deltaY = e.deltaY;
                    var xy = currentContentRef.xy;
                    currentContentRef.moveTo([xy[0] - deltaX, xy[1] - deltaY]);
                }
            });
            at.on('panend', function (e) {
                if (null === _this.__currentContentRef)
                    return;
                _this.__currentContentRef.__scrollEndTimeId = setTimeout$3(function () {
                    if (null !== _this.__currentContentRef) {
                        _this.targets = e.targets;
                        _this.emit(TYPE_SCROLL_END, _this.__currentContentRef.xy);
                    }
                }, SCROLL_END_DELAY);
            });
            at.on('at:start', function (e) {
                var _a;
                _this.emit('at:start');
                var targetEl = e.target;
                _this.__currentContentRef = _this.getContentRef(targetEl);
                (_a = _this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.stop();
            });
            at.on('at:end', function () {
                var _a;
                _this.emit('at:end');
                (_a = _this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.snap();
            });
            var swipe = at.get('swipe');
            if (swipe) {
                swipe.velocity = 1;
            }
            at.on('swipe', function (e) {
                var currentContentRef = _this.__currentContentRef;
                if (null === currentContentRef)
                    return;
                _this.targets = e.targets;
                var deltaX = e.speedX * 200;
                var deltaY = e.speedY * 200;
                currentContentRef.dampScroll([currentContentRef.xy[0] - deltaX, currentContentRef.xy[1] - deltaY]);
            });
            at.on('at:after', function (e) {
                _this.emit(e.name, e);
            });
            return _this;
        }
        Wrap.prototype.update = function () {
            var _a = this.el, clientWidth = _a.clientWidth, clientHeight = _a.clientHeight;
            this.size = [clientWidth, clientHeight];
            this.emit(TYPE_BEFORE_UPDATED, this.size);
        };
        Wrap.prototype.getContentRef = function (elOrIndex) {
            var e_1, _a;
            var __contentRefList = this.__contentRefList;
            if (void 0 === elOrIndex) {
                return this.__currentContentRef || __contentRefList[__contentRefList.length - 1];
            }
            else if ('number' === typeof elOrIndex) {
                return __contentRefList[Number(elOrIndex)] || null;
            }
            else {
                try {
                    for (var __contentRefList_1 = __values(__contentRefList), __contentRefList_1_1 = __contentRefList_1.next(); !__contentRefList_1_1.done; __contentRefList_1_1 = __contentRefList_1.next()) {
                        var ref = __contentRefList_1_1.value;
                        if (ref.el.contains(elOrIndex)) {
                            return ref;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (__contentRefList_1_1 && !__contentRefList_1_1.done && (_a = __contentRefList_1.return)) _a.call(__contentRefList_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return this.__currentContentRef;
            }
        };
        Wrap.prototype.active = function (contentRef) {
            this.__currentContentRef = contentRef;
        };
        Wrap.prototype.moveTo = function (distXY) {
            var _a;
            return (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.moveTo(distXY);
        };
        Wrap.prototype.scrollTo = function (distXY, duration, easing) {
            var _a;
            if (duration === void 0) { duration = 1000; }
            (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.scrollTo(distXY, duration, easing);
        };
        Wrap.prototype.scrollToElement = function (el, offset, duration, easing) {
            var _a;
            (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.scrollToElement(el, offset, duration, easing);
        };
        Wrap.prototype.dampScroll = function (distXY, damping) {
            var _a;
            if (damping === void 0) { damping = this.options.damping; }
            (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.dampScroll(distXY, damping);
        };
        Wrap.prototype.stop = function () {
            var _a;
            (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.stop();
        };
        Wrap.prototype.destroy = function () {
            this.emit(TYPE_BEFORE_DESTROY$1);
            this.at.destroy();
            _super.prototype.destroy.call(this);
        };
        return Wrap;
    }(AnyEvent));

    var Wrap = Wrap$1;
    var default_1$1 = (function (_super) {
        __extends(default_1, _super);
        function default_1(el, options) {
            return _super.call(this, el, options) || this;
        }
        default_1.prototype.use = function (plugin, options) {
            plugin(this, options);
        };
        return default_1;
    }(Wrap));

    var insertCss$1 = {exports: {}};

    var containers = []; // will store container HTMLElement references
    var styleElements = []; // will store {prepend: HTMLElement, append: HTMLElement}

    var usage = 'insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).';

    function insertCss(css, options) {
        options = options || {};

        if (css === undefined) {
            throw new Error(usage);
        }

        var position = options.prepend === true ? 'prepend' : 'append';
        var container = options.container !== undefined ? options.container : document.querySelector('head');
        var containerId = containers.indexOf(container);

        // first time we see this container, create the necessary entries
        if (containerId === -1) {
            containerId = containers.push(container) - 1;
            styleElements[containerId] = {};
        }

        // try to get the correponding container + position styleElement, create it otherwise
        var styleElement;

        if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
            styleElement = styleElements[containerId][position];
        } else {
            styleElement = styleElements[containerId][position] = createStyleElement();

            if (position === 'prepend') {
                container.insertBefore(styleElement, container.childNodes[0]);
            } else {
                container.appendChild(styleElement);
            }
        }

        // strip potential UTF-8 BOM if css was read from a file
        if (css.charCodeAt(0) === 0xFEFF) { css = css.substr(1, css.length); }

        // actually add the stylesheet
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText += css;
        } else {
            styleElement.textContent += css;
        }

        return styleElement;
    }
    function createStyleElement() {
        var styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        return styleElement;
    }

    insertCss$1.exports = insertCss;
    var insertCss_2 = insertCss$1.exports.insertCss = insertCss;

    var TRACK_WIDTH = "8px";
    var TRACK_COLOR = 'rgba(177,177,177,0.6)';
    var THUMB_COLOR = 'rgba(55,55,55,0.6)';
    var TRACK_CLASS_NAME = 'scroll-bar-track';
    var THUMB_CLASS_NAME = 'scroll-bar-thumb';
    var BAR_CSS = "\n." + TRACK_CLASS_NAME + "{\n    right:0;\n    bottom:0;\n    background: " + TRACK_COLOR + ";\n    transition:opacity .5s ease-out;\n}\n\n." + TRACK_CLASS_NAME + " > ." + THUMB_CLASS_NAME + "{\n    width: " + TRACK_WIDTH + ";\n    height: " + TRACK_WIDTH + ";\n    background: " + THUMB_COLOR + ";\n    border-radius:4px;\n}\n\n." + TRACK_CLASS_NAME + "-x{\n    left:0;\n    height:" + TRACK_WIDTH + ";\n}\n\n." + TRACK_CLASS_NAME + "-y{\n    top:0;\n    width:" + TRACK_WIDTH + ";\n}\n";

    var TYPE_UPDATED = 'updated';

    var setTimeout$2 = window.setTimeout;
    function index$1 (wrapRef) {
        var allow = wrapRef.options.allow;
        var timeoutIds = [-1, -1];
        var __isFoucsInBar = false;
        insertCss_2(BAR_CSS);
        var barRefs = runTwice(createBar);
        wrapRef.on(TYPE_UPDATED, function () {
            updateBar(wrapRef, barRefs, allow);
        });
        wrapRef.on(['scroll', 'resize'], function () {
            updateBar(wrapRef, barRefs, allow);
        });
        wrapRef.at.on('at:start', function () {
            __isFoucsInBar = false;
            updateBar(wrapRef, barRefs, allow);
        });
        wrapRef.on('beforeDestroy', function () {
            barRefs.forEach(function (barRef) {
                var _a;
                barRef.destroy();
                (_a = barRef.el.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(barRef.el);
            });
        });
        function createBar(axisIndex) {
            var currentAxis = AxisList[axisIndex];
            var trackEl = createDOM(wrapRef.el, currentAxis);
            var barRef = new Wrap(trackEl, { allow: [Axis.X === currentAxis, Axis.Y === currentAxis], overflowDistance: 0 });
            setStyle(barRef.el, { position: 'absolute' });
            barRef.on('panstart', function () {
                __isFoucsInBar = true;
            });
            barRef.on('at:start', function () {
                updateBar(wrapRef, barRefs, allow);
            });
            barRef.on('scroll', function () {
                if (!__isFoucsInBar)
                    return;
                var thumbRef = barRef.getContentRef();
                var contentRef = wrapRef.getContentRef();
                if (null !== contentRef) {
                    var xy = contentRef.xy;
                    var nextXY = __spread(xy);
                    nextXY[axisIndex] =
                        (-thumbRef.xy[axisIndex] * contentRef.contentSize[axisIndex]) / barRef.size[axisIndex];
                    contentRef.moveTo(nextXY);
                }
            });
            barRef.at.on('tap', function (e) {
                var thumbRef = barRef.getContentRef();
                if (null !== thumbRef && e.target === barRef.el) {
                    __isFoucsInBar = true;
                    var _a = barRef.el.getBoundingClientRect(), x = _a.x, y = _a.y;
                    var contentSize = thumbRef.contentSize;
                    var newXY = [0, 0];
                    newXY[axisIndex] = [x, y][axisIndex] - [e.x, e.y][axisIndex] + contentSize[axisIndex] / 2;
                    thumbRef.dampScroll(newXY);
                }
            });
            return barRef;
        }
        function updateBar(wrapRef, barRefs, allow) {
            var contentRef = wrapRef.getContentRef();
            var contentSize = contentRef.contentSize, minXY = contentRef.minXY, maxXY = contentRef.maxXY;
            var wrapSize = wrapRef.size;
            runTwice(function (i) {
                var _a;
                var barRef = barRefs[i];
                var trackElement = barRef.el;
                if (allow[i]) {
                    changeDOMVisible(trackElement);
                }
                else {
                    changeDOMVisible(trackElement, false);
                    return;
                }
                if (contentSize[i] > wrapSize[i]) {
                    changeOpacity(trackElement, 1);
                    clearTimeout(timeoutIds[i]);
                    timeoutIds[i] = setTimeout$2(function () {
                        changeOpacity(trackElement, 0);
                    }, 1000);
                    var thumbRef = barRefs[i].getContentRef();
                    if (null !== thumbRef) {
                        var _b = __read(calcBarXorY(contentRef.xy[i], wrapSize[i], contentSize[i], maxXY[i], minXY[i]), 2), thumbSize = _b[0], thumbXorY = _b[1];
                        var thumbElement = barRef.getContentRef().el;
                        setStyle(thumbElement, (_a = {}, _a[['width', 'height'][i]] = thumbSize + "px", _a));
                        thumbRef.update();
                        thumbRef.maxXY[i] = 0;
                        thumbRef.minXY[i] = Math.min(0, thumbSize - barRef.size[i]);
                        var xy = thumbRef.xy;
                        var newXY = __spread(xy);
                        newXY[i] = thumbXorY;
                        thumbRef.moveTo(newXY);
                    }
                }
                else {
                    changeDOMVisible(trackElement, false);
                }
            });
        }
    }
    function createDOM(el, axis) {
        if (axis === void 0) { axis = Axis.X; }
        var trackEl = createDOMDiv([TRACK_CLASS_NAME, TRACK_CLASS_NAME + "-" + axis]);
        var thumbEl = createDOMDiv([THUMB_CLASS_NAME, THUMB_CLASS_NAME + "-" + axis]);
        trackEl.appendChild(thumbEl);
        el.appendChild(trackEl);
        return trackEl;
    }
    function calcBarXorY(scrollViewXOrY, wrapSize, contentSize, maxXorY, minXorY) {
        var trackSize = wrapSize;
        var scrollViewMaxDistance = maxXorY - minXorY;
        var scale = 1;
        var thumbLength = (wrapSize / contentSize) * trackSize;
        if (minXorY >= scrollViewXOrY) {
            scale = 1 - (minXorY - scrollViewXOrY) / wrapSize;
        }
        else if (maxXorY < scrollViewXOrY) {
            scale = 1 - (scrollViewXOrY - maxXorY) / wrapSize;
        }
        thumbLength *= scale;
        var thumbXorY = -((scrollViewXOrY / scrollViewMaxDistance) * (trackSize - thumbLength));
        return [thumbLength, thumbXorY];
    }

    var TYPE_BEFORE_DESTROY = 'beforeDestroy';

    var setTimeout$1 = window.setTimeout;
    var WHEEL = 'wheel';
    function normalizeWheel(e, LINE_HEIGHT, PAGE_HEIGHT) {
        if (LINE_HEIGHT === void 0) { LINE_HEIGHT = 40; }
        if (PAGE_HEIGHT === void 0) { PAGE_HEIGHT = 800; }
        var deltaX = e.deltaX, deltaY = e.deltaY, deltaMode = e.deltaMode;
        if (deltaMode == e.DOM_DELTA_LINE) {
            deltaX *= LINE_HEIGHT;
            deltaY *= LINE_HEIGHT;
        }
        else if (deltaMode == e.DOM_DELTA_PAGE) {
            deltaX *= PAGE_HEIGHT;
            deltaY *= PAGE_HEIGHT;
        }
        return [deltaX, deltaY];
    }
    function watchWheel (el, onChange) {
        var _lastWheelTime;
        var _endTimeoutId;
        var _deltaYCounter = 0;
        var _deltaXCounter = 0;
        function __onWheel(e) {
            var _a = __read(normalizeWheel(e), 2), deltaX = _a[0], deltaY = _a[1];
            _deltaXCounter += deltaX;
            _deltaYCounter += deltaY;
            function _dispatchEvent(type, payload) {
                var wheelEvent2 = __assign({ target: e.target, deltaX: deltaX,
                    deltaY: deltaY,
                    type: type }, payload);
                var event = new Event('wheel' + type);
                onChange(wheelEvent2);
                el.dispatchEvent(event);
            }
            clearTimeout(_endTimeoutId);
            _endTimeoutId = setTimeout$1(function () {
                var timeDiff = Date.now() - _lastWheelTime;
                var vx = _deltaXCounter / timeDiff;
                var vy = _deltaYCounter / timeDiff;
                _lastWheelTime = void 0;
                _deltaXCounter = 0;
                _deltaYCounter = 0;
                _dispatchEvent('end', { vx: vx, vy: vy });
            }, 16);
            if (void 0 === _lastWheelTime) {
                _dispatchEvent('start');
            }
            else {
                _dispatchEvent('move');
            }
            _lastWheelTime = Date.now();
        }
        el.addEventListener(WHEEL, __onWheel);
        return function () {
            el.removeEventListener(WHEEL, __onWheel);
        };
    }

    function index (wrapRef) {
        var allow = wrapRef.options.allow;
        var el = wrapRef.el;
        var unWatch = watchWheel(el, function (_a) {
            var type = _a.type, deltaX = _a.deltaX, deltaY = _a.deltaY, vx = _a.vx, vy = _a.vy, target = _a.target;
            var currentContentRef = wrapRef.getContentRef(target);
            if (null === currentContentRef)
                return;
            wrapRef.active(currentContentRef);
            var isWheelX = allow[0] && (!allow[1] || deltaX);
            var deltaXOrY = deltaY || deltaX;
            var vXorY = vy || vx;
            var xy = currentContentRef.xy;
            wrapRef.targets = [target];
            if ('start' === type) {
                currentContentRef.stop();
            }
            if ('move' === type || 'start' === type) {
                var nextXY = isWheelX ? [xy[0] + deltaXOrY, xy[1]] : [xy[0], xy[1] + deltaXOrY];
                wrapRef.dampScroll(nextXY);
            }
            else if ('end' === type) {
                var nextXY = isWheelX ? [xy[0] + vXorY * 5, xy[1]] : [xy[0], xy[1] + Math.ceil(vXorY) * 30];
                wrapRef.dampScroll(nextXY);
            }
        });
        wrapRef.on(TYPE_BEFORE_DESTROY, unWatch);
    }

    var default_1 = (function (_super) {
        __extends(default_1, _super);
        function default_1(el, options) {
            var _this = _super.call(this, el, options) || this;
            index$1(_this);
            index(_this);
            return _this;
        }
        return default_1;
    }(default_1$1));

    return default_1;

}));
