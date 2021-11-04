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
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
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

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var default_1$a = (function () {
        function default_1() {
            this.listenersMap = {};
        }
        default_1.prototype.on = function (eventName, listener, beforeEmit) {
            var e_1, _a;
            var eventNames = Array.isArray(eventName) ? eventName : [eventName];
            try {
                for (var eventNames_1 = __values(eventNames), eventNames_1_1 = eventNames_1.next(); !eventNames_1_1.done; eventNames_1_1 = eventNames_1.next()) {
                    var name = eventNames_1_1.value;
                    if (void 0 === this.listenersMap[name]) {
                        this.listenersMap[name] = [];
                    }
                    listener.beforeEmit = beforeEmit;
                    this.listenersMap[name].push(listener);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (eventNames_1_1 && !eventNames_1_1.done && (_a = eventNames_1.return)) _a.call(eventNames_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return this;
        };
        default_1.prototype.emit = function (eventName, payload) {
            var e_2, _a;
            var listeners = this.listenersMap[eventName];
            if (void 0 !== listeners && 0 < listeners.length) {
                try {
                    for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
                        var listener = listeners_1_1.value;
                        if (void 0 === listener.beforeEmit) {
                            listener(payload);
                        }
                        else if (void 0 !== payload && listener.beforeEmit(payload)) {
                            listener(payload);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        default_1.prototype.off = function (eventName, listener) {
            var listeners = this.listenersMap[eventName];
            if (void 0 !== listeners) {
                if (void 0 === listener) {
                    delete this.listenersMap[eventName];
                }
                else {
                    var index = listeners.findIndex(function (fn) { return fn === listener; });
                    listeners.splice(index, 1);
                }
            }
        };
        default_1.prototype.destroy = function () {
            this.listenersMap = {};
        };
        return default_1;
    }());

    var AnyEvent = default_1$a;

    var ObjectToString = Object.prototype.toString;
    function isRegExp(input) {
        return '[object RegExp]' === ObjectToString.call(input);
    }
    function isFunction(input) {
        return '[object Function]' === ObjectToString.call(input);
    }
    var CLIENT_X = 'clientX';
    var CLIENT_Y = 'clientY';
    var COMPUTE_INTERVAL = 16;
    var INPUT_START = 'start';
    var INPUT_MOVE = 'move';
    var INPUT_CANCEL = 'cancel';
    var INPUT_END = 'end';
    var DIRECTION_LEFT = 'left';
    var DIRECTION_RIGHT = 'right';
    var DIRECTION_UP = 'up';
    var DIRECTION_DOWN = 'down';
    var TOUCH = 'touch';
    var MOUSE = 'mouse';
    var TOUCH_START = TOUCH + INPUT_START;
    var TOUCH_MOVE = TOUCH + INPUT_MOVE;
    var TOUCH_END = TOUCH + INPUT_END;
    var TOUCH_CANCEL = TOUCH + INPUT_CANCEL;
    var MOUSE_UP = MOUSE + DIRECTION_UP;
    var MOUSE_MOVE = MOUSE + INPUT_MOVE;
    var MOUSE_DOWN = MOUSE + DIRECTION_DOWN;
    var STATUS_POSSIBLE = 'p';
    var STATUS_START = INPUT_START;
    var STATUS_MOVE = INPUT_MOVE;
    var STATUS_END = INPUT_END;
    var STATUS_RECOGNIZED = 'r';
    var STATUS_FAILED = 'f';
    var STATUS_CANCELLED = INPUT_CANCEL;

    function round2(n) {
        return Math.round(n * 100) / 100;
    }

    function inputCreator () {
        var id = 0;
        var prevInput;
        var activeInput;
        var startInput;
        var startMultiInput;
        return function (basicsInput) {
            prevInput = activeInput;
            if (void 0 !== basicsInput) {
                id = Number.MAX_SAFE_INTEGER > id ? ++id : 1;
                var pureInput = extendInput(basicsInput, id);
                activeInput = pureInput;
                var isStart = pureInput.isStart, pointLength = pureInput.pointLength;
                if (isStart) {
                    startInput = pureInput;
                    prevInput = void 0;
                    if (1 < pointLength) {
                        startMultiInput = pureInput;
                    }
                    else {
                        startMultiInput = void 0;
                    }
                }
                return __assign(__assign({}, pureInput), { prevInput: prevInput, startMultiInput: startMultiInput, startInput: startInput });
            }
        };
    }
    function getCenter(points) {
        var length = points.length;
        if (0 < length) {
            if (1 === length) {
                var _a = points[0], clientX = _a.clientX, clientY = _a.clientY;
                return { x: Math.round(clientX), y: Math.round(clientY) };
            }
            var countPoint = points.reduce(function (countPoint, point) {
                countPoint.x += point[CLIENT_X];
                countPoint.y += point[CLIENT_Y];
                return countPoint;
            }, { x: 0, y: 0 });
            return { x: Math.round(countPoint.x / length), y: Math.round(countPoint.y / length) };
        }
    }
    function extendInput(basicsInput, id) {
        var stage = basicsInput.stage, points = basicsInput.points, changedPoints = basicsInput.changedPoints, nativeEvent = basicsInput.nativeEvent;
        var pointLength = points.length;
        var isStart = INPUT_START === stage;
        var isEnd = (INPUT_END === stage && 0 === pointLength) || INPUT_CANCEL === stage;
        var timestamp = Date.now();
        var _a = getCenter(points) || getCenter(changedPoints), x = _a.x, y = _a.y;
        var currentTarget = nativeEvent.currentTarget;
        return Object.assign(basicsInput, {
            id: id,
            x: x, y: y,
            timestamp: timestamp,
            isStart: isStart, isEnd: isEnd,
            pointLength: pointLength,
            currentTarget: currentTarget,
            getOffset: function (el) {
                if (el === void 0) { el = currentTarget; }
                var rect = el.getBoundingClientRect();
                return { x: x - Math.round(rect.left), y: y - Math.round(rect.top) };
            }
        });
    }

    function mouse () {
        var prevPoints;
        var isPressed = false;
        var _target = null;
        var createInput = inputCreator();
        return function (event) {
            var clientX = event.clientX, clientY = event.clientY, type = event.type, button = event.button, target = event.target;
            var points = [{ clientX: clientX, clientY: clientY, target: target }];
            var stage;
            if (MOUSE_DOWN === type && 0 === button) {
                _target = target;
                isPressed = true;
                stage = INPUT_START;
            }
            else if (isPressed) {
                if (MOUSE_MOVE === type) {
                    stage = INPUT_MOVE;
                }
                else if (MOUSE_UP === type) {
                    points = [];
                    stage = INPUT_END;
                    isPressed = false;
                }
            }
            var changedPoints = prevPoints || [{ clientX: clientX, clientY: clientY, target: target }];
            prevPoints = [{ clientX: clientX, clientY: clientY, target: target }];
            if (void 0 !== stage) {
                return createInput({
                    stage: stage,
                    changedPoints: changedPoints,
                    points: points,
                    target: _target,
                    targets: [_target],
                    nativeEvent: event
                });
            }
        };
    }

    function touch (el) {
        var createInput = inputCreator();
        return function (event) {
            var targets = [];
            var points = [];
            Array.from(event.touches).forEach(function (_a) {
                var clientX = _a.clientX, clientY = _a.clientY, target = _a.target;
                if (el === null || el === void 0 ? void 0 : el.contains(target)) {
                    targets.push(target);
                    points.push({ clientX: clientX, clientY: clientY, target: target });
                }
            });
            var changedPoints = Array.from(event.changedTouches).map(function (_a) {
                var clientX = _a.clientX, clientY = _a.clientY, target = _a.target;
                return ({ clientX: clientX, clientY: clientY, target: target });
            });
            return createInput({
                stage: event.type.replace('touch', ''),
                changedPoints: changedPoints,
                points: points,
                nativeEvent: event,
                target: event.target,
                targets: targets
            });
        };
    }

    function dispatchDomEvent (el, payload, eventInit) {
        payload.target; payload.currentTarget; var type = payload.type, data = __rest(payload, ["target", "currentTarget", "type"]);
        var event;
        if (document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(type, eventInit === null || eventInit === void 0 ? void 0 : eventInit.bubbles, eventInit === null || eventInit === void 0 ? void 0 : eventInit.cancelable);
        }
        else {
            event = new Event(type, eventInit);
        }
        Object.assign(event, data, {
            match: function () {
                return payload.targets.every(function (target) {
                    return event.currentTarget.contains(target);
                });
            }
        });
        return el.dispatchEvent(event);
    }

    function canPreventDefault (event, options) {
        if (!options.preventDefault)
            return false;
        var preventDefault = true;
        if (null !== event.target) {
            var preventDefaultExclude = options.preventDefaultExclude;
            if (isRegExp(preventDefaultExclude)) {
                if ('tagName' in event.target) {
                    var tagName = event.target.tagName;
                    preventDefault = !preventDefaultExclude.test(tagName);
                }
            }
            else if (isFunction(preventDefaultExclude)) {
                preventDefault = !preventDefaultExclude(event);
            }
        }
        return preventDefault;
    }

    var TOUCH_EVENTS = [TOUCH_START, TOUCH_MOVE, TOUCH_END, TOUCH_CANCEL];
    function bindElement (el, catchEvent, options) {
        TOUCH_EVENTS.forEach(function (eventName) {
            el.addEventListener(eventName, catchEvent, options);
        });
        el.addEventListener(MOUSE_DOWN, catchEvent, options);
        window.addEventListener(MOUSE_MOVE, catchEvent, options);
        window.addEventListener(MOUSE_UP, catchEvent, options);
        return function () {
            TOUCH_EVENTS.forEach(function (eventName) {
                el.removeEventListener(eventName, catchEvent);
            });
            el.removeEventListener(MOUSE_DOWN, catchEvent, options);
            window.removeEventListener(MOUSE_MOVE, catchEvent, options);
            window.removeEventListener(MOUSE_UP, catchEvent, options);
        };
    }

    var AT_AFTER = 'at:after';
    function emit2 (at, payload) {
        var type = payload.type, target = payload.target;
        at.emit(type, payload);
        at.emit(AT_AFTER, payload);
        if (!!at.options.domEvents
            && void 0 !== at.el
            && null !== target) {
            dispatchDomEvent(target, payload, at.options.domEvents);
            dispatchDomEvent(target, __assign(__assign({}, payload), { _type: payload.type, type: AT_AFTER }), at.options.domEvents);
        }
    }

    var DEFAULT_OPTIONS$7 = {
        domEvents: { bubbles: true, cancelable: true },
        preventDefault: true,
        preventDefaultExclude: /^(?:INPUT|TEXTAREA|BUTTON|SELECT)$/,
    };
    var AT = "at";
    var AnyTouch = (function (_super) {
        __extends(AnyTouch, _super);
        function AnyTouch(el, options) {
            var e_1, _a, _b;
            var _this = _super.call(this) || this;
            _this._$computeFunctionMap = {};
            _this._$recognizerMap = {};
            _this._$recognizers = [];
            _this.el = el;
            _this.options = __assign(__assign({}, DEFAULT_OPTIONS$7), options);
            try {
                for (var _c = __values(AnyTouch._$Recognizers), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), Recognizer_1 = _e[0], options_1 = _e[1];
                    _this.use(Recognizer_1, options_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var createInputFromTouch = touch(_this.el);
            var createInputFromMouse = mouse();
            _this._$inputCreatorMap = (_b = {},
                _b[TOUCH_START] = createInputFromTouch,
                _b[TOUCH_MOVE] = createInputFromTouch,
                _b[TOUCH_END] = createInputFromTouch,
                _b[TOUCH_CANCEL] = createInputFromTouch,
                _b[MOUSE_DOWN] = createInputFromMouse,
                _b[MOUSE_MOVE] = createInputFromMouse,
                _b[MOUSE_UP] = createInputFromMouse,
                _b);
            if (void 0 !== el) {
                el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
                var supportsPassive_1 = false;
                try {
                    var opts = {};
                    Object.defineProperty(opts, 'passive', ({
                        get: function () {
                            supportsPassive_1 = true;
                        }
                    }));
                    window.addEventListener('_', function () { return void 0; }, opts);
                }
                catch (_f) { }
                _this.on('unbind', bindElement(el, _this.catchEvent.bind(_this), !_this.options.preventDefault && supportsPassive_1 ? { passive: true } : false));
            }
            return _this;
        }
        AnyTouch.prototype.target = function (el) {
            var _this = this;
            return {
                on: function (eventName, listener) {
                    _this.on(eventName, listener, function (event) {
                        var targets = event.targets;
                        return targets.every(function (target) { return el.contains(target); });
                    });
                }
            };
        };
        AnyTouch.prototype.catchEvent = function (event) {
            var e_2, _a;
            var _this = this;
            var stopPropagation = function () { return event.stopPropagation(); };
            var preventDefault = function () { return event.preventDefault(); };
            var stopImmediatePropagation = function () { return event.stopImmediatePropagation(); };
            if (canPreventDefault(event, this.options)) {
                preventDefault();
            }
            var input = this._$inputCreatorMap[event.type](event);
            if (void 0 !== input) {
                var AT_WITH_STATUS = AT + ':' + input.stage;
                this.emit(AT, input);
                this.emit(AT_WITH_STATUS, input);
                var domEvents = this.options.domEvents;
                if (false !== domEvents) {
                    var target = event.target;
                    if (null !== target) {
                        dispatchDomEvent(target, __assign(__assign({}, input), { type: AT }), domEvents);
                        dispatchDomEvent(target, __assign(__assign({}, input), { type: AT_WITH_STATUS }), domEvents);
                    }
                }
                var computed_1 = input;
                for (var k in this._$computeFunctionMap) {
                    Object.assign(computed_1, this._$computeFunctionMap[k](computed_1));
                }
                var _loop_1 = function (recognizer) {
                    if (recognizer.disabled)
                        return "continue";
                    recognizer.recognize(computed_1, function (type) {
                        var payload = __assign(__assign({}, computed_1), { type: type, name: recognizer.name, stopPropagation: stopPropagation,
                            preventDefault: preventDefault,
                            stopImmediatePropagation: stopImmediatePropagation });
                        Object === null || Object === void 0 ? void 0 : Object.freeze(payload);
                        if (void 0 === _this.beforeEachHook) {
                            emit2(_this, payload);
                        }
                        else {
                            _this.beforeEachHook(recognizer, _this._$recognizerMap, function () {
                                emit2(_this, payload);
                            });
                        }
                    });
                };
                try {
                    for (var _b = __values(this._$recognizers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var recognizer = _c.value;
                        _loop_1(recognizer);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        };
        AnyTouch.prototype.use = function (Recognizer, recognizerOptions) {
            var e_3, _a;
            var name = recognizerOptions === null || recognizerOptions === void 0 ? void 0 : recognizerOptions.name;
            if (void 0 !== name && void 0 !== this._$recognizerMap[name])
                return;
            var recognizer = new Recognizer(recognizerOptions);
            try {
                for (var _b = __values(recognizer.computeFunctions), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var createComputeFunction = _c.value;
                    var _id = createComputeFunction._id;
                    if (void 0 === this._$computeFunctionMap[_id]) {
                        this._$computeFunctionMap[_id] = createComputeFunction();
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this._$recognizerMap[recognizer.name] = recognizer;
            this._$recognizers.push(this._$recognizerMap[recognizer.name]);
        };
        AnyTouch.prototype.removeUse = function (recognizerName) {
            var e_4, _a;
            if (void 0 === recognizerName) {
                this._$recognizers = [];
                this._$recognizerMap = {};
            }
            else {
                try {
                    for (var _b = __values(this._$recognizers.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var _d = __read(_c.value, 2), index = _d[0], recognizer = _d[1];
                        if (recognizerName === recognizer.options.name) {
                            this._$recognizers.splice(index, 1);
                            delete this._$recognizerMap[recognizerName];
                            break;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            }
        };
        AnyTouch.prototype.beforeEach = function (hook) {
            this.beforeEachHook = hook;
        };
        AnyTouch.prototype.get = function (name) {
            return this._$recognizerMap[name];
        };
        AnyTouch.prototype.set = function (options) {
            this.options = __assign(__assign({}, this.options), options);
        };
        AnyTouch.prototype.destroy = function () {
            this.emit('unbind');
            _super.prototype.destroy.call(this);
        };
        AnyTouch.version = '1.0.13-alpha.0';
        AnyTouch._$Recognizers = [];
        AnyTouch._$computeFunctionMap = {};
        AnyTouch.use = function (Recognizer, recognizerOptions) {
            AnyTouch._$Recognizers.push([Recognizer, recognizerOptions]);
        };
        return AnyTouch;
    }(AnyEvent));

    var AnyTouch$1 = AnyTouch;

    function resetStatus (recognizer) {
        if ([STATUS_END, STATUS_CANCELLED, STATUS_RECOGNIZED, STATUS_FAILED].includes(recognizer.status)) {
            recognizer.status = STATUS_POSSIBLE;
        }
    }

    function flow(isVaild, lastStatus, stage) {
        var _a, _b, _c, _d, _e, _f, _g;
        var STATE_MAP = {
            1: (_a = {},
                _a[STATUS_POSSIBLE] = (_b = {},
                    _b[INPUT_MOVE] = STATUS_START,
                    _b[INPUT_END] = STATUS_FAILED,
                    _b[INPUT_CANCEL] = STATUS_FAILED,
                    _b),
                _a[STATUS_START] = (_c = {},
                    _c[INPUT_MOVE] = STATUS_MOVE,
                    _c[INPUT_END] = STATUS_END,
                    _c[INPUT_CANCEL] = STATUS_CANCELLED,
                    _c),
                _a[STATUS_MOVE] = (_d = {},
                    _d[INPUT_MOVE] = STATUS_MOVE,
                    _d[INPUT_END] = STATUS_END,
                    _d[INPUT_CANCEL] = STATUS_CANCELLED,
                    _d),
                _a),
            0: (_e = {},
                _e[STATUS_START] = (_f = {},
                    _f[INPUT_MOVE] = STATUS_FAILED,
                    _f[INPUT_END] = STATUS_END,
                    _f[INPUT_CANCEL] = STATUS_CANCELLED,
                    _f),
                _e[STATUS_MOVE] = (_g = {},
                    _g[INPUT_START] = STATUS_FAILED,
                    _g[INPUT_MOVE] = STATUS_FAILED,
                    _g[INPUT_END] = STATUS_END,
                    _g[INPUT_CANCEL] = STATUS_CANCELLED,
                    _g),
                _e)
        };
        var stageToStatusMap = STATE_MAP[Number(isVaild)][lastStatus];
        return void 0 !== stageToStatusMap && stageToStatusMap[stage] || lastStatus;
    }
    function recognizeForPressMoveLike (recognizer, computed, emit) {
        var isVaild = recognizer._$test(computed);
        resetStatus(recognizer);
        var stage = computed.stage;
        recognizer.status = flow(isVaild, recognizer.status, stage);
        recognizer._$isRecognized = [STATUS_START, STATUS_MOVE].includes(recognizer.status);
        var name = recognizer.name, status = recognizer.status, isRecognized = recognizer._$isRecognized;
        if (isRecognized) {
            emit(name);
        }
        if (isRecognized || [STATUS_END, STATUS_CANCELLED].includes(recognizer.status)) {
            emit(name + status);
        }
        return isVaild;
    }

    var default_1$9 = (function () {
        function default_1(options) {
            this.disabled = false;
            this._$isRecognized = false;
            this.status = STATUS_POSSIBLE;
            this.computeFunctions = [];
            this.options = options;
            this.name = this.options.name;
        }
        default_1.prototype.set = function (options) {
            if (void 0 !== options) {
                this.options = __assign(__assign({}, this.options), options);
            }
            return this;
        };
        default_1.prototype._$isValidPointLength = function (pointLength) {
            return this.options.pointLength === pointLength;
        };
        return default_1;
    }());

    var Recognizer = default_1$9;

    var getVLength = (function (v) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    });

    var getDotProduct = (function (v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    });

    var getRadian = (function (v1, v2) {
        var mr = getVLength(v1) * getVLength(v2);
        if (mr === 0)
            return 0;
        var r = getDotProduct(v1, v2) / mr;
        if (r > 1)
            r = 1;
        return Math.acos(r);
    });

    var getCross = (function (v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    });

    var radianToAngle = (function (radian) { return radian / Math.PI * 180; });

    var getAngle = (function (v1, v2) {
        var angle = getRadian(v1, v2);
        if (getCross(v1, v2) > 0) {
            angle *= -1;
        }
        return radianToAngle(angle);
    });

    var getDirection = (function (x, y) {
        if (Math.abs(x) >= Math.abs(y)) {
            return 0 < x ? DIRECTION_RIGHT : DIRECTION_LEFT;
        }
        else {
            return 0 < y ? DIRECTION_DOWN : DIRECTION_UP;
        }
    });

    function computeVector(input) {
        return {
            x: input.points[1][CLIENT_X] - input.points[0][CLIENT_X],
            y: input.points[1][CLIENT_Y] - input.points[0][CLIENT_Y]
        };
    }
    function _computeVectorForMutli (input) {
        var prevInput = input.prevInput, startMultiInput = input.startMultiInput;
        if (void 0 !== startMultiInput &&
            void 0 !== prevInput &&
            input.id !== startMultiInput.id &&
            1 < prevInput.pointLength &&
            1 < input.pointLength) {
            return {
                startV: computeVector(startMultiInput),
                prevV: computeVector(prevInput),
                activeV: computeVector(input)
            };
        }
    }

    function ComputeAngle() {
        return function (input) {
            var _vs = (input === null || input === void 0 ? void 0 : input._vs) || _computeVectorForMutli(input);
            if (void 0 !== _vs && _vs.activeV) {
                var prevV = _vs.prevV, startV = _vs.startV, activeV = _vs.activeV;
                var deltaAngle = Math.round(getAngle(activeV, prevV));
                var angle = Math.round(getAngle(activeV, startV));
                return { angle: angle, deltaAngle: deltaAngle, _vs: _vs };
            }
        };
    }
    ComputeAngle._id = "a";

    function ComputeDeltaXY() {
        return function (input) {
            var prevInput = input.prevInput;
            var deltaX = 0;
            var deltaY = 0;
            var deltaXYAngle = 0;
            if (void 0 !== prevInput) {
                deltaX = input.x - prevInput.x;
                deltaY = input.y - prevInput.y;
                if (0 !== deltaX || 0 !== deltaY) {
                    var deltaXY = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
                    deltaXYAngle = Math.round(radianToAngle(Math.acos(Math.abs(deltaX) / deltaXY)));
                }
            }
            return { deltaX: deltaX, deltaY: deltaY, deltaXYAngle: deltaXYAngle };
        };
    }
    ComputeDeltaXY._id = "b";

    function ComputeDistance() {
        var displacementX = 0;
        var displacementY = 0;
        var distanceX = 0;
        var distanceY = 0;
        var distance = 0;
        var overallDirection;
        return function (input) {
            var stage = input.stage, startInput = input.startInput;
            if (INPUT_START === stage) {
                displacementX = 0;
                displacementY = 0;
                distanceX = 0;
                distanceY = 0;
                distance = 0;
            }
            else if (INPUT_MOVE === stage) {
                displacementX = Math.round(input.points[0][CLIENT_X] - startInput.points[0][CLIENT_X]);
                displacementY = Math.round(input.points[0][CLIENT_Y] - startInput.points[0][CLIENT_Y]);
                distanceX = Math.abs(displacementX);
                distanceY = Math.abs(displacementY);
                distance = Math.round(getVLength({ x: distanceX, y: distanceY }));
                overallDirection = getDirection(displacementX, displacementY);
            }
            return {
                displacementX: displacementX, displacementY: displacementY, distanceX: distanceX, distanceY: distanceY, distance: distance, overallDirection: overallDirection
            };
        };
    }
    ComputeDistance._id = "c";

    function ComputeMaxLength() {
        var maxPointLength = 0;
        return function (input) {
            var stage = input.stage;
            if (INPUT_START === stage) {
                maxPointLength = input.pointLength;
            }
            return { maxPointLength: maxPointLength };
        };
    }
    ComputeMaxLength._id = "d";

    function ComputeScale() {
        return function (input) {
            var _vs = (input === null || input === void 0 ? void 0 : input._vs) || _computeVectorForMutli(input);
            if (void 0 !== _vs && _vs.activeV) {
                var prevV = _vs.prevV, startV = _vs.startV, activeV = _vs.activeV;
                var deltaScale = round2(getVLength(activeV) / getVLength(prevV));
                var scale = round2(getVLength(activeV) / getVLength(startV));
                return { scale: scale, deltaScale: deltaScale, _vs: _vs };
            }
        };
    }
    ComputeScale._id = "e";

    function ComputeVAndDir() {
        var velocityX = 0;
        var velocityY = 0;
        var speedX = 0;
        var speedY = 0;
        var direction;
        var _lastValidInput;
        return function (input) {
            if (void 0 !== input) {
                var stage = input.stage;
                _lastValidInput = _lastValidInput || input.startInput;
                var deltaTime = input.timestamp - _lastValidInput.timestamp;
                if (INPUT_MOVE === stage && COMPUTE_INTERVAL < deltaTime) {
                    var deltaX = input.x - _lastValidInput.x;
                    var deltaY = input.y - _lastValidInput.y;
                    speedX = Math.round(deltaX / deltaTime * 100) / 100;
                    speedY = Math.round(deltaY / deltaTime * 100) / 100;
                    velocityX = Math.abs(speedX);
                    velocityY = Math.abs(speedY);
                    direction = getDirection(deltaX, deltaY) || direction;
                    _lastValidInput = input;
                }
            }
            return { velocityX: velocityX, velocityY: velocityY, speedX: speedX, speedY: speedY, direction: direction };
        };
    }
    ComputeVAndDir._id = "f";

    var DEFAULT_OPTIONS$6 = {
        name: 'tap',
        pointLength: 1,
        tapTimes: 1,
        waitNextTapTime: 300,
        maxDistance: 2,
        maxDistanceFromPrevTap: 9,
        maxPressTime: 250,
    };
    var default_1$8 = (function (_super) {
        __extends(default_1, _super);
        function default_1(options) {
            var _this = _super.call(this, __assign(__assign({}, DEFAULT_OPTIONS$6), options)) || this;
            _this.computeFunctions = [ComputeDistance, ComputeMaxLength];
            _this._$tapCount = 0;
            return _this;
        }
        default_1.prototype._isValidDistanceFromPrevTap = function (center) {
            if (void 0 !== this._$prevTapPoint) {
                var distanceFromPreviousTap = getVLength({ x: center.x - this._$prevTapPoint.x, y: center.y - this._$prevTapPoint.y });
                this._$prevTapPoint = center;
                return this.options.maxDistanceFromPrevTap >= distanceFromPreviousTap;
            }
            else {
                this._$prevTapPoint = center;
                return true;
            }
        };
        default_1.prototype._isValidInterval = function () {
            var now = performance.now();
            if (void 0 === this._$prevTapTime) {
                this._$prevTapTime = now;
                return true;
            }
            else {
                var interval = now - this._$prevTapTime;
                this._$prevTapTime = now;
                return interval < this.options.waitNextTapTime;
            }
        };
        default_1.prototype.recognize = function (computed, emit) {
            var stage = computed.stage, x = computed.x, y = computed.y;
            if (INPUT_END !== stage)
                return;
            this.status = STATUS_POSSIBLE;
            if (this._$test(computed)) {
                clearTimeout(this._$countDownToFailTimer);
                if (this._isValidDistanceFromPrevTap({ x: x, y: y }) && this._isValidInterval()) {
                    this._$tapCount++;
                }
                else {
                    this._$tapCount = 1;
                }
                if (0 === this._$tapCount % this.options.tapTimes) {
                    this.status = STATUS_RECOGNIZED;
                    emit(this.options.name, __assign(__assign({}, computed), { tapCount: this._$tapCount }));
                    this._$reset();
                }
                else {
                    this._$countDownToFail();
                }
            }
            else {
                this._$reset();
                this.status = STATUS_FAILED;
            }
        };
        default_1.prototype._$countDownToFail = function () {
            var _this = this;
            this._$countDownToFailTimer = setTimeout(function () {
                _this.status = STATUS_FAILED;
                _this._$reset();
            }, this.options.waitNextTapTime);
        };
        default_1.prototype._$reset = function () {
            this._$tapCount = 0;
            this._$prevTapPoint = void 0;
            this._$prevTapTime = void 0;
        };
        default_1.prototype._$test = function (computed) {
            var startInput = computed.startInput, pointLength = computed.pointLength;
            var deltaTime = computed.timestamp - startInput.timestamp;
            var maxPointLength = computed.maxPointLength, distance = computed.distance;
            return maxPointLength === this.options.pointLength &&
                0 === pointLength &&
                this.options.maxDistance >= distance &&
                this.options.maxPressTime > deltaTime;
        };
        return default_1;
    }(Recognizer));

    var Tap = default_1$8;

    var DEFAULT_OPTIONS$5 = {
        name: 'pan',
        threshold: 10,
        pointLength: 1
    };
    var default_1$7 = (function (_super) {
        __extends(default_1, _super);
        function default_1(options) {
            var _this = _super.call(this, __assign(__assign({}, DEFAULT_OPTIONS$5), options)) || this;
            _this.computeFunctions = [ComputeVAndDir, ComputeDistance, ComputeDeltaXY];
            return _this;
        }
        default_1.prototype._$test = function (computed) {
            var pointLength = computed.pointLength, distance = computed.distance;
            return ((this._$isRecognized || this.options.threshold <= distance) &&
                this._$isValidPointLength(pointLength));
        };
        default_1.prototype.recognize = function (computed, emit) {
            var isRecognized = void 0 !== computed.direction && recognizeForPressMoveLike(this, computed, emit);
            if (isRecognized) {
                emit(this.options.name + computed.direction);
            }
        };
        return default_1;
    }(Recognizer));

    var Pan = default_1$7;

    var DEFAULT_OPTIONS$4 = {
        name: 'swipe',
        threshold: 10,
        velocity: 0.3,
        pointLength: 1,
    };
    var default_1$6 = (function (_super) {
        __extends(default_1, _super);
        function default_1(options) {
            var _this = _super.call(this, __assign(__assign({}, DEFAULT_OPTIONS$4), options)) || this;
            _this.computeFunctions = [ComputeDistance, ComputeVAndDir, ComputeMaxLength];
            return _this;
        }
        default_1.prototype._$test = function (computed) {
            if (INPUT_END !== computed.stage)
                return false;
            var velocityX = computed.velocityX, velocityY = computed.velocityY, maxPointLength = computed.maxPointLength, distance = computed.distance;
            return this.options.pointLength === maxPointLength &&
                this.options.threshold < distance &&
                this.options.velocity < Math.max(velocityX, velocityY);
        };
        default_1.prototype.recognize = function (computed, emit) {
            if (this._$test(computed)) {
                emit(this.options.name);
                emit(this.options.name + computed.direction);
            }
        };
        return default_1;
    }(Recognizer));

    var Swipe = default_1$6;

    var DEFAULT_OPTIONS$3 = {
        name: 'press',
        pointLength: 1,
        maxDistance: 9,
        minPressTime: 251,
    };
    var default_1$5 = (function (_super) {
        __extends(default_1, _super);
        function default_1(options) {
            var _this = _super.call(this, __assign(__assign({}, DEFAULT_OPTIONS$3), options)) || this;
            _this.computeFunctions = [ComputeDistance];
            return _this;
        }
        default_1.prototype.recognize = function (computed, emit) {
            var _this = this;
            var stage = computed.stage, startInput = computed.startInput, pointLength = computed.pointLength;
            if (INPUT_START === stage && this._$isValidPointLength(pointLength)) {
                resetStatus(this);
                this._$cancel();
                this._timeoutId = setTimeout(function () {
                    _this.status = STATUS_RECOGNIZED;
                    emit(_this.options.name);
                }, this.options.minPressTime);
            }
            else if (INPUT_END === stage && STATUS_RECOGNIZED === this.status) {
                emit("" + this.options.name + DIRECTION_UP);
            }
            else if (STATUS_RECOGNIZED !== this.status) {
                var deltaTime = computed.timestamp - startInput.timestamp;
                if (!this._$test(computed) ||
                    (this.options.minPressTime > deltaTime && [INPUT_END, INPUT_CANCEL].includes(stage))) {
                    this._$cancel();
                    this.status = STATUS_FAILED;
                }
            }
        };
        default_1.prototype._$test = function (computed) {
            var distance = computed.distance;
            return this.options.maxDistance > distance;
        };
        default_1.prototype._$cancel = function () {
            clearTimeout(this._timeoutId);
        };
        return default_1;
    }(Recognizer));

    var Press = default_1$5;

    var DEFAULT_OPTIONS$2 = {
        name: 'pinch',
        threshold: 0,
        pointLength: 2,
    };
    var default_1$4 = (function (_super) {
        __extends(default_1, _super);
        function default_1(options) {
            var _this = _super.call(this, __assign(__assign({}, DEFAULT_OPTIONS$2), options)) || this;
            _this.computeFunctions = [ComputeScale];
            return _this;
        }
        default_1.prototype._$test = function (computed) {
            var pointLength = computed.pointLength, scale = computed.scale;
            return this._$isValidPointLength(pointLength)
                && void 0 !== scale
                && (this.options.threshold < Math.abs(scale - 1) || this._$isRecognized);
        };
        default_1.prototype.recognize = function (computed, emit) {
            recognizeForPressMoveLike(this, computed, emit);
        };
        return default_1;
    }(Recognizer));

    var Pinch = default_1$4;

    var DEFAULT_OPTIONS$1 = {
        name: 'rotate',
        threshold: 0,
        pointLength: 2,
    };
    var default_1$3 = (function (_super) {
        __extends(default_1, _super);
        function default_1(options) {
            var _this = _super.call(this, __assign(__assign({}, DEFAULT_OPTIONS$1), options)) || this;
            _this.computeFunctions = [ComputeAngle];
            return _this;
        }
        default_1.prototype._$test = function (computed) {
            var pointLength = computed.pointLength, angle = computed.angle;
            return this._$isValidPointLength(pointLength) && (this.options.threshold < Math.abs(angle) || this._$isRecognized);
        };
        default_1.prototype.recognize = function (computed, emit) {
            recognizeForPressMoveLike(this, computed, emit);
        };
        return default_1;
    }(Recognizer));

    var Rotate = default_1$3;

    AnyTouch$1.use(Tap);
    AnyTouch$1.use(Pan);
    AnyTouch$1.use(Swipe);
    AnyTouch$1.use(Press);
    AnyTouch$1.use(Pinch);
    AnyTouch$1.use(Rotate);
    AnyTouch$1.Tap = Tap;
    AnyTouch$1.Pan = Pan;
    AnyTouch$1.Swipe = Swipe;
    AnyTouch$1.Press = Press;
    AnyTouch$1.Pinch = Pinch;
    AnyTouch$1.Rotate = Rotate;
    AnyTouch$1.STATUS_POSSIBLE = STATUS_POSSIBLE;
    AnyTouch$1.STATUS_START = STATUS_START;
    AnyTouch$1.STATUS_MOVE = STATUS_MOVE;
    AnyTouch$1.STATUS_END = STATUS_END;
    AnyTouch$1.STATUS_CANCELLED = STATUS_CANCELLED;
    AnyTouch$1.STATUS_FAILED = STATUS_FAILED;
    AnyTouch$1.STATUS_RECOGNIZED = STATUS_RECOGNIZED;

    /**
     * A collection of shims that provide minimal functionality of the ES6 collections.
     *
     * These implementations are not meant to be used outside of the ResizeObserver
     * modules as they cover only a limited range of use cases.
     */
    /* eslint-disable require-jsdoc, valid-jsdoc */
    var MapShim = (function () {
        if (typeof Map !== 'undefined') {
            return Map;
        }
        /**
         * Returns index in provided array that matches the specified key.
         *
         * @param {Array<Array>} arr
         * @param {*} key
         * @returns {number}
         */
        function getIndex(arr, key) {
            var result = -1;
            arr.some(function (entry, index) {
                if (entry[0] === key) {
                    result = index;
                    return true;
                }
                return false;
            });
            return result;
        }
        return /** @class */ (function () {
            function class_1() {
                this.__entries__ = [];
            }
            Object.defineProperty(class_1.prototype, "size", {
                /**
                 * @returns {boolean}
                 */
                get: function () {
                    return this.__entries__.length;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @param {*} key
             * @returns {*}
             */
            class_1.prototype.get = function (key) {
                var index = getIndex(this.__entries__, key);
                var entry = this.__entries__[index];
                return entry && entry[1];
            };
            /**
             * @param {*} key
             * @param {*} value
             * @returns {void}
             */
            class_1.prototype.set = function (key, value) {
                var index = getIndex(this.__entries__, key);
                if (~index) {
                    this.__entries__[index][1] = value;
                }
                else {
                    this.__entries__.push([key, value]);
                }
            };
            /**
             * @param {*} key
             * @returns {void}
             */
            class_1.prototype.delete = function (key) {
                var entries = this.__entries__;
                var index = getIndex(entries, key);
                if (~index) {
                    entries.splice(index, 1);
                }
            };
            /**
             * @param {*} key
             * @returns {void}
             */
            class_1.prototype.has = function (key) {
                return !!~getIndex(this.__entries__, key);
            };
            /**
             * @returns {void}
             */
            class_1.prototype.clear = function () {
                this.__entries__.splice(0);
            };
            /**
             * @param {Function} callback
             * @param {*} [ctx=null]
             * @returns {void}
             */
            class_1.prototype.forEach = function (callback, ctx) {
                if (ctx === void 0) { ctx = null; }
                for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    callback.call(ctx, entry[1], entry[0]);
                }
            };
            return class_1;
        }());
    })();

    /**
     * Detects whether window and document objects are available in current environment.
     */
    var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

    // Returns global object of a current environment.
    var global$1 = (function () {
        if (typeof global !== 'undefined' && global.Math === Math) {
            return global;
        }
        if (typeof self !== 'undefined' && self.Math === Math) {
            return self;
        }
        if (typeof window !== 'undefined' && window.Math === Math) {
            return window;
        }
        // eslint-disable-next-line no-new-func
        return Function('return this')();
    })();

    /**
     * A shim for the requestAnimationFrame which falls back to the setTimeout if
     * first one is not supported.
     *
     * @returns {number} Requests' identifier.
     */
    var requestAnimationFrame$1 = (function () {
        if (typeof requestAnimationFrame === 'function') {
            // It's required to use a bounded function because IE sometimes throws
            // an "Invalid calling object" error if rAF is invoked without the global
            // object on the left hand side.
            return requestAnimationFrame.bind(global$1);
        }
        return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
    })();

    // Defines minimum timeout before adding a trailing call.
    var trailingTimeout = 2;
    /**
     * Creates a wrapper function which ensures that provided callback will be
     * invoked only once during the specified delay period.
     *
     * @param {Function} callback - Function to be invoked after the delay period.
     * @param {number} delay - Delay after which to invoke callback.
     * @returns {Function}
     */
    function throttle (callback, delay) {
        var leadingCall = false, trailingCall = false, lastCallTime = 0;
        /**
         * Invokes the original callback function and schedules new invocation if
         * the "proxy" was called during current request.
         *
         * @returns {void}
         */
        function resolvePending() {
            if (leadingCall) {
                leadingCall = false;
                callback();
            }
            if (trailingCall) {
                proxy();
            }
        }
        /**
         * Callback invoked after the specified delay. It will further postpone
         * invocation of the original function delegating it to the
         * requestAnimationFrame.
         *
         * @returns {void}
         */
        function timeoutCallback() {
            requestAnimationFrame$1(resolvePending);
        }
        /**
         * Schedules invocation of the original function.
         *
         * @returns {void}
         */
        function proxy() {
            var timeStamp = Date.now();
            if (leadingCall) {
                // Reject immediately following calls.
                if (timeStamp - lastCallTime < trailingTimeout) {
                    return;
                }
                // Schedule new call to be in invoked when the pending one is resolved.
                // This is important for "transitions" which never actually start
                // immediately so there is a chance that we might miss one if change
                // happens amids the pending invocation.
                trailingCall = true;
            }
            else {
                leadingCall = true;
                trailingCall = false;
                setTimeout(timeoutCallback, delay);
            }
            lastCallTime = timeStamp;
        }
        return proxy;
    }

    // Minimum delay before invoking the update of observers.
    var REFRESH_DELAY = 20;
    // A list of substrings of CSS properties used to find transition events that
    // might affect dimensions of observed elements.
    var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
    // Check if MutationObserver is available.
    var mutationObserverSupported = typeof MutationObserver !== 'undefined';
    /**
     * Singleton controller class which handles updates of ResizeObserver instances.
     */
    var ResizeObserverController = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserverController.
         *
         * @private
         */
        function ResizeObserverController() {
            /**
             * Indicates whether DOM listeners have been added.
             *
             * @private {boolean}
             */
            this.connected_ = false;
            /**
             * Tells that controller has subscribed for Mutation Events.
             *
             * @private {boolean}
             */
            this.mutationEventsAdded_ = false;
            /**
             * Keeps reference to the instance of MutationObserver.
             *
             * @private {MutationObserver}
             */
            this.mutationsObserver_ = null;
            /**
             * A list of connected observers.
             *
             * @private {Array<ResizeObserverSPI>}
             */
            this.observers_ = [];
            this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
            this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
        }
        /**
         * Adds observer to observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be added.
         * @returns {void}
         */
        ResizeObserverController.prototype.addObserver = function (observer) {
            if (!~this.observers_.indexOf(observer)) {
                this.observers_.push(observer);
            }
            // Add listeners if they haven't been added yet.
            if (!this.connected_) {
                this.connect_();
            }
        };
        /**
         * Removes observer from observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be removed.
         * @returns {void}
         */
        ResizeObserverController.prototype.removeObserver = function (observer) {
            var observers = this.observers_;
            var index = observers.indexOf(observer);
            // Remove observer if it's present in registry.
            if (~index) {
                observers.splice(index, 1);
            }
            // Remove listeners if controller has no connected observers.
            if (!observers.length && this.connected_) {
                this.disconnect_();
            }
        };
        /**
         * Invokes the update of observers. It will continue running updates insofar
         * it detects changes.
         *
         * @returns {void}
         */
        ResizeObserverController.prototype.refresh = function () {
            var changesDetected = this.updateObservers_();
            // Continue running updates if changes have been detected as there might
            // be future ones caused by CSS transitions.
            if (changesDetected) {
                this.refresh();
            }
        };
        /**
         * Updates every observer from observers list and notifies them of queued
         * entries.
         *
         * @private
         * @returns {boolean} Returns "true" if any observer has detected changes in
         *      dimensions of it's elements.
         */
        ResizeObserverController.prototype.updateObservers_ = function () {
            // Collect observers that have active observations.
            var activeObservers = this.observers_.filter(function (observer) {
                return observer.gatherActive(), observer.hasActive();
            });
            // Deliver notifications in a separate cycle in order to avoid any
            // collisions between observers, e.g. when multiple instances of
            // ResizeObserver are tracking the same element and the callback of one
            // of them changes content dimensions of the observed target. Sometimes
            // this may result in notifications being blocked for the rest of observers.
            activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
            return activeObservers.length > 0;
        };
        /**
         * Initializes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.connect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already added.
            if (!isBrowser || this.connected_) {
                return;
            }
            // Subscription to the "Transitionend" event is used as a workaround for
            // delayed transitions. This way it's possible to capture at least the
            // final state of an element.
            document.addEventListener('transitionend', this.onTransitionEnd_);
            window.addEventListener('resize', this.refresh);
            if (mutationObserverSupported) {
                this.mutationsObserver_ = new MutationObserver(this.refresh);
                this.mutationsObserver_.observe(document, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            }
            else {
                document.addEventListener('DOMSubtreeModified', this.refresh);
                this.mutationEventsAdded_ = true;
            }
            this.connected_ = true;
        };
        /**
         * Removes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.disconnect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already removed.
            if (!isBrowser || !this.connected_) {
                return;
            }
            document.removeEventListener('transitionend', this.onTransitionEnd_);
            window.removeEventListener('resize', this.refresh);
            if (this.mutationsObserver_) {
                this.mutationsObserver_.disconnect();
            }
            if (this.mutationEventsAdded_) {
                document.removeEventListener('DOMSubtreeModified', this.refresh);
            }
            this.mutationsObserver_ = null;
            this.mutationEventsAdded_ = false;
            this.connected_ = false;
        };
        /**
         * "Transitionend" event handler.
         *
         * @private
         * @param {TransitionEvent} event
         * @returns {void}
         */
        ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
            var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
            // Detect whether transition may affect dimensions of an element.
            var isReflowProperty = transitionKeys.some(function (key) {
                return !!~propertyName.indexOf(key);
            });
            if (isReflowProperty) {
                this.refresh();
            }
        };
        /**
         * Returns instance of the ResizeObserverController.
         *
         * @returns {ResizeObserverController}
         */
        ResizeObserverController.getInstance = function () {
            if (!this.instance_) {
                this.instance_ = new ResizeObserverController();
            }
            return this.instance_;
        };
        /**
         * Holds reference to the controller's instance.
         *
         * @private {ResizeObserverController}
         */
        ResizeObserverController.instance_ = null;
        return ResizeObserverController;
    }());

    /**
     * Defines non-writable/enumerable properties of the provided target object.
     *
     * @param {Object} target - Object for which to define properties.
     * @param {Object} props - Properties to be defined.
     * @returns {Object} Target object.
     */
    var defineConfigurable = (function (target, props) {
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
            var key = _a[_i];
            Object.defineProperty(target, key, {
                value: props[key],
                enumerable: false,
                writable: false,
                configurable: true
            });
        }
        return target;
    });

    /**
     * Returns the global object associated with provided element.
     *
     * @param {Object} target
     * @returns {Object}
     */
    var getWindowOf = (function (target) {
        // Assume that the element is an instance of Node, which means that it
        // has the "ownerDocument" property from which we can retrieve a
        // corresponding global object.
        var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
        // Return the local global object if it's not possible extract one from
        // provided element.
        return ownerGlobal || global$1;
    });

    // Placeholder of an empty content rectangle.
    var emptyRect = createRectInit(0, 0, 0, 0);
    /**
     * Converts provided string to a number.
     *
     * @param {number|string} value
     * @returns {number}
     */
    function toFloat(value) {
        return parseFloat(value) || 0;
    }
    /**
     * Extracts borders size from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @param {...string} positions - Borders positions (top, right, ...)
     * @returns {number}
     */
    function getBordersSize(styles) {
        var positions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            positions[_i - 1] = arguments[_i];
        }
        return positions.reduce(function (size, position) {
            var value = styles['border-' + position + '-width'];
            return size + toFloat(value);
        }, 0);
    }
    /**
     * Extracts paddings sizes from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @returns {Object} Paddings box.
     */
    function getPaddings(styles) {
        var positions = ['top', 'right', 'bottom', 'left'];
        var paddings = {};
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var position = positions_1[_i];
            var value = styles['padding-' + position];
            paddings[position] = toFloat(value);
        }
        return paddings;
    }
    /**
     * Calculates content rectangle of provided SVG element.
     *
     * @param {SVGGraphicsElement} target - Element content rectangle of which needs
     *      to be calculated.
     * @returns {DOMRectInit}
     */
    function getSVGContentRect(target) {
        var bbox = target.getBBox();
        return createRectInit(0, 0, bbox.width, bbox.height);
    }
    /**
     * Calculates content rectangle of provided HTMLElement.
     *
     * @param {HTMLElement} target - Element for which to calculate the content rectangle.
     * @returns {DOMRectInit}
     */
    function getHTMLElementContentRect(target) {
        // Client width & height properties can't be
        // used exclusively as they provide rounded values.
        var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
        // By this condition we can catch all non-replaced inline, hidden and
        // detached elements. Though elements with width & height properties less
        // than 0.5 will be discarded as well.
        //
        // Without it we would need to implement separate methods for each of
        // those cases and it's not possible to perform a precise and performance
        // effective test for hidden elements. E.g. even jQuery's ':visible' filter
        // gives wrong results for elements with width & height less than 0.5.
        if (!clientWidth && !clientHeight) {
            return emptyRect;
        }
        var styles = getWindowOf(target).getComputedStyle(target);
        var paddings = getPaddings(styles);
        var horizPad = paddings.left + paddings.right;
        var vertPad = paddings.top + paddings.bottom;
        // Computed styles of width & height are being used because they are the
        // only dimensions available to JS that contain non-rounded values. It could
        // be possible to utilize the getBoundingClientRect if only it's data wasn't
        // affected by CSS transformations let alone paddings, borders and scroll bars.
        var width = toFloat(styles.width), height = toFloat(styles.height);
        // Width & height include paddings and borders when the 'border-box' box
        // model is applied (except for IE).
        if (styles.boxSizing === 'border-box') {
            // Following conditions are required to handle Internet Explorer which
            // doesn't include paddings and borders to computed CSS dimensions.
            //
            // We can say that if CSS dimensions + paddings are equal to the "client"
            // properties then it's either IE, and thus we don't need to subtract
            // anything, or an element merely doesn't have paddings/borders styles.
            if (Math.round(width + horizPad) !== clientWidth) {
                width -= getBordersSize(styles, 'left', 'right') + horizPad;
            }
            if (Math.round(height + vertPad) !== clientHeight) {
                height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
            }
        }
        // Following steps can't be applied to the document's root element as its
        // client[Width/Height] properties represent viewport area of the window.
        // Besides, it's as well not necessary as the <html> itself neither has
        // rendered scroll bars nor it can be clipped.
        if (!isDocumentElement(target)) {
            // In some browsers (only in Firefox, actually) CSS width & height
            // include scroll bars size which can be removed at this step as scroll
            // bars are the only difference between rounded dimensions + paddings
            // and "client" properties, though that is not always true in Chrome.
            var vertScrollbar = Math.round(width + horizPad) - clientWidth;
            var horizScrollbar = Math.round(height + vertPad) - clientHeight;
            // Chrome has a rather weird rounding of "client" properties.
            // E.g. for an element with content width of 314.2px it sometimes gives
            // the client width of 315px and for the width of 314.7px it may give
            // 314px. And it doesn't happen all the time. So just ignore this delta
            // as a non-relevant.
            if (Math.abs(vertScrollbar) !== 1) {
                width -= vertScrollbar;
            }
            if (Math.abs(horizScrollbar) !== 1) {
                height -= horizScrollbar;
            }
        }
        return createRectInit(paddings.left, paddings.top, width, height);
    }
    /**
     * Checks whether provided element is an instance of the SVGGraphicsElement.
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    var isSVGGraphicsElement = (function () {
        // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
        // interface.
        if (typeof SVGGraphicsElement !== 'undefined') {
            return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
        }
        // If it's so, then check that element is at least an instance of the
        // SVGElement and that it has the "getBBox" method.
        // eslint-disable-next-line no-extra-parens
        return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
            typeof target.getBBox === 'function'); };
    })();
    /**
     * Checks whether provided element is a document element (<html>).
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    function isDocumentElement(target) {
        return target === getWindowOf(target).document.documentElement;
    }
    /**
     * Calculates an appropriate content rectangle for provided html or svg element.
     *
     * @param {Element} target - Element content rectangle of which needs to be calculated.
     * @returns {DOMRectInit}
     */
    function getContentRect(target) {
        if (!isBrowser) {
            return emptyRect;
        }
        if (isSVGGraphicsElement(target)) {
            return getSVGContentRect(target);
        }
        return getHTMLElementContentRect(target);
    }
    /**
     * Creates rectangle with an interface of the DOMRectReadOnly.
     * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
     *
     * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
     * @returns {DOMRectReadOnly}
     */
    function createReadOnlyRect(_a) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        // If DOMRectReadOnly is available use it as a prototype for the rectangle.
        var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
        var rect = Object.create(Constr.prototype);
        // Rectangle's properties are not writable and non-enumerable.
        defineConfigurable(rect, {
            x: x, y: y, width: width, height: height,
            top: y,
            right: x + width,
            bottom: height + y,
            left: x
        });
        return rect;
    }
    /**
     * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
     * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
     *
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} width - Rectangle's width.
     * @param {number} height - Rectangle's height.
     * @returns {DOMRectInit}
     */
    function createRectInit(x, y, width, height) {
        return { x: x, y: y, width: width, height: height };
    }

    /**
     * Class that is responsible for computations of the content rectangle of
     * provided DOM element and for keeping track of it's changes.
     */
    var ResizeObservation = /** @class */ (function () {
        /**
         * Creates an instance of ResizeObservation.
         *
         * @param {Element} target - Element to be observed.
         */
        function ResizeObservation(target) {
            /**
             * Broadcasted width of content rectangle.
             *
             * @type {number}
             */
            this.broadcastWidth = 0;
            /**
             * Broadcasted height of content rectangle.
             *
             * @type {number}
             */
            this.broadcastHeight = 0;
            /**
             * Reference to the last observed content rectangle.
             *
             * @private {DOMRectInit}
             */
            this.contentRect_ = createRectInit(0, 0, 0, 0);
            this.target = target;
        }
        /**
         * Updates content rectangle and tells whether it's width or height properties
         * have changed since the last broadcast.
         *
         * @returns {boolean}
         */
        ResizeObservation.prototype.isActive = function () {
            var rect = getContentRect(this.target);
            this.contentRect_ = rect;
            return (rect.width !== this.broadcastWidth ||
                rect.height !== this.broadcastHeight);
        };
        /**
         * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
         * from the corresponding properties of the last observed content rectangle.
         *
         * @returns {DOMRectInit} Last observed content rectangle.
         */
        ResizeObservation.prototype.broadcastRect = function () {
            var rect = this.contentRect_;
            this.broadcastWidth = rect.width;
            this.broadcastHeight = rect.height;
            return rect;
        };
        return ResizeObservation;
    }());

    var ResizeObserverEntry = /** @class */ (function () {
        /**
         * Creates an instance of ResizeObserverEntry.
         *
         * @param {Element} target - Element that is being observed.
         * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
         */
        function ResizeObserverEntry(target, rectInit) {
            var contentRect = createReadOnlyRect(rectInit);
            // According to the specification following properties are not writable
            // and are also not enumerable in the native implementation.
            //
            // Property accessors are not being used as they'd require to define a
            // private WeakMap storage which may cause memory leaks in browsers that
            // don't support this type of collections.
            defineConfigurable(this, { target: target, contentRect: contentRect });
        }
        return ResizeObserverEntry;
    }());

    var ResizeObserverSPI = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {ResizeObserverCallback} callback - Callback function that is invoked
         *      when one of the observed elements changes it's content dimensions.
         * @param {ResizeObserverController} controller - Controller instance which
         *      is responsible for the updates of observer.
         * @param {ResizeObserver} callbackCtx - Reference to the public
         *      ResizeObserver instance which will be passed to callback function.
         */
        function ResizeObserverSPI(callback, controller, callbackCtx) {
            /**
             * Collection of resize observations that have detected changes in dimensions
             * of elements.
             *
             * @private {Array<ResizeObservation>}
             */
            this.activeObservations_ = [];
            /**
             * Registry of the ResizeObservation instances.
             *
             * @private {Map<Element, ResizeObservation>}
             */
            this.observations_ = new MapShim();
            if (typeof callback !== 'function') {
                throw new TypeError('The callback provided as parameter 1 is not a function.');
            }
            this.callback_ = callback;
            this.controller_ = controller;
            this.callbackCtx_ = callbackCtx;
        }
        /**
         * Starts observing provided element.
         *
         * @param {Element} target - Element to be observed.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.observe = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            // Do nothing if element is already being observed.
            if (observations.has(target)) {
                return;
            }
            observations.set(target, new ResizeObservation(target));
            this.controller_.addObserver(this);
            // Force the update of observations.
            this.controller_.refresh();
        };
        /**
         * Stops observing provided element.
         *
         * @param {Element} target - Element to stop observing.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.unobserve = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            // Do nothing if element is not being observed.
            if (!observations.has(target)) {
                return;
            }
            observations.delete(target);
            if (!observations.size) {
                this.controller_.removeObserver(this);
            }
        };
        /**
         * Stops observing all elements.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.disconnect = function () {
            this.clearActive();
            this.observations_.clear();
            this.controller_.removeObserver(this);
        };
        /**
         * Collects observation instances the associated element of which has changed
         * it's content rectangle.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.gatherActive = function () {
            var _this = this;
            this.clearActive();
            this.observations_.forEach(function (observation) {
                if (observation.isActive()) {
                    _this.activeObservations_.push(observation);
                }
            });
        };
        /**
         * Invokes initial callback function with a list of ResizeObserverEntry
         * instances collected from active resize observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.broadcastActive = function () {
            // Do nothing if observer doesn't have active observations.
            if (!this.hasActive()) {
                return;
            }
            var ctx = this.callbackCtx_;
            // Create ResizeObserverEntry instance for every active observation.
            var entries = this.activeObservations_.map(function (observation) {
                return new ResizeObserverEntry(observation.target, observation.broadcastRect());
            });
            this.callback_.call(ctx, entries, ctx);
            this.clearActive();
        };
        /**
         * Clears the collection of active observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.clearActive = function () {
            this.activeObservations_.splice(0);
        };
        /**
         * Tells whether observer has active observations.
         *
         * @returns {boolean}
         */
        ResizeObserverSPI.prototype.hasActive = function () {
            return this.activeObservations_.length > 0;
        };
        return ResizeObserverSPI;
    }());

    // Registry of internal observers. If WeakMap is not available use current shim
    // for the Map collection as it has all required methods and because WeakMap
    // can't be fully polyfilled anyway.
    var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
    /**
     * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
     * exposing only those methods and properties that are defined in the spec.
     */
    var ResizeObserver = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {ResizeObserverCallback} callback - Callback that is invoked when
         *      dimensions of the observed elements change.
         */
        function ResizeObserver(callback) {
            if (!(this instanceof ResizeObserver)) {
                throw new TypeError('Cannot call a class as a function.');
            }
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            var controller = ResizeObserverController.getInstance();
            var observer = new ResizeObserverSPI(callback, controller, this);
            observers.set(this, observer);
        }
        return ResizeObserver;
    }());
    // Expose public methods of ResizeObserver.
    [
        'observe',
        'unobserve',
        'disconnect'
    ].forEach(function (method) {
        ResizeObserver.prototype[method] = function () {
            var _a;
            return (_a = observers.get(this))[method].apply(_a, arguments);
        };
    });

    var index = (function () {
        // Export existing implementation if available.
        if (typeof global$1.ResizeObserver !== 'undefined') {
            return global$1.ResizeObserver;
        }
        return ResizeObserver;
    })();

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

    function isObjectLike$3(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike$3;

    /** Detect free variable `global` from Node.js. */

    var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal$1;

    var freeGlobal = _freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root$2 = freeGlobal || freeSelf || Function('return this')();

    var _root = root$2;

    var root$1 = _root;

    /** Built-in value references. */
    var Symbol$3 = root$1.Symbol;

    var _Symbol = Symbol$3;

    var Symbol$2 = _Symbol;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$2.toString;

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
      var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
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

    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$1.toString;

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
    function baseGetTag$2(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    var _baseGetTag = baseGetTag$2;

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */

    function overArg$1(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    var _overArg = overArg$1;

    var overArg = _overArg;

    /** Built-in value references. */
    var getPrototype$1 = overArg(Object.getPrototypeOf, Object);

    var _getPrototype = getPrototype$1;

    var baseGetTag$1 = _baseGetTag,
        getPrototype = _getPrototype,
        isObjectLike$2 = isObjectLike_1;

    /** `Object#toString` result references. */
    var objectTag = '[object Object]';

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to infer the `Object` constructor. */
    var objectCtorString = funcToString.call(Object);

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * @static
     * @memberOf _
     * @since 0.8.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject$1(value) {
      if (!isObjectLike$2(value) || baseGetTag$1(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }

    var isPlainObject_1 = isPlainObject$1;

    var isObjectLike$1 = isObjectLike_1,
        isPlainObject = isPlainObject_1;

    /**
     * Checks if `value` is likely a DOM element.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return isObjectLike$1(value) && value.nodeType === 1 && !isPlainObject(value);
    }

    var isElement_1 = isElement;

    var raf$2 = {exports: {}};

    // Generated by CoffeeScript 1.12.2
    (function() {
      var getNanoSeconds, hrtime;

      if ((typeof performance !== "undefined" && performance !== null) && performance.now) ; else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
        hrtime = process.hrtime;
        getNanoSeconds = function() {
          var hr;
          hr = hrtime();
          return hr[0] * 1e9 + hr[1];
        };
        getNanoSeconds();
        process.uptime() * 1e9;
      } else if (Date.now) ; else {
        new Date().getTime();
      }

    }).call(commonjsGlobal);

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
      , root = typeof window === 'undefined' ? commonjsGlobal : window
      , vendors = ['moz', 'webkit']
      , suffix = 'AnimationFrame'
      , raf = root['request' + suffix]
      , caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

    for(var i = 0; !raf && i < vendors.length; i++) {
      raf = root[vendors[i] + 'Request' + suffix];
      caf = root[vendors[i] + 'Cancel' + suffix]
          || root[vendors[i] + 'CancelRequest' + suffix];
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
      return raf.call(root, fn)
    };
    raf$2.exports.cancel = function() {
      caf.apply(root, arguments);
    };
    raf$2.exports.polyfill = function(object) {
      if (!object) {
        object = root;
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

    var DIRECTION;
    (function (DIRECTION) {
        DIRECTION["X"] = "x";
        DIRECTION["Y"] = "y";
    })(DIRECTION || (DIRECTION = {}));
    function setStyle(el, styles) {
        for (var key in styles) {
            el.style[key] = styles[key] || '';
        }
    }
    function setTranslate(el, x, y) {
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
        if (visible) {
            setStyle(el, { display: '' });
        }
        else {
            setStyle(el, { display: 'none' });
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

    var Content = (function (_super) {
        __extends(Content, _super);
        function Content(contentEl, wrapEl, options) {
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
            _this.wrapEl = wrapEl;
            _this.__options = options;
            setStyle(contentEl, { position: 'absolute' });
            _this.update();
            if (_this.__options.watchResize) {
                var ro = new index(function () {
                    _this.update();
                    _this.emit('resize');
                });
                ro.observe(contentEl);
            }
            return _this;
        }
        Content.prototype.set = function (options) {
            this.__options = __assign(__assign({}, this.__options), options);
            this.update();
        };
        Content.prototype.update = function () {
            var _a = this, wrapEl = _a.wrapEl, contentEl = _a.el;
            var offsetWidth = contentEl.offsetWidth, offsetHeight = contentEl.offsetHeight, clientWidth = contentEl.clientWidth, clientHeight = contentEl.clientHeight, scrollWidth = contentEl.scrollWidth, scrollHeight = contentEl.scrollHeight;
            this.wrapSize = [wrapEl.clientWidth, wrapEl.clientHeight];
            this.contentSize = [offsetWidth - clientWidth + scrollWidth, offsetHeight - clientHeight + scrollHeight];
            this.minXY = this.__options.minXY ? this.__options.minXY(this) : [
                Math.min(0, this.wrapSize[0] - this.contentSize[0]),
                Math.min(0, this.wrapSize[1] - this.contentSize[1]),
            ];
            this.maxXY = this.__options.maxXY ? this.__options.maxXY(this) : [0, 0];
        };
        Content.prototype.stop = function () {
            var _this = this;
            if (this.isScrolling && this.xy.every(function (v, i) { return inRange_1(v, _this.minXY[i], _this.maxXY[i]); })) {
                this.emit('scroll-end');
            }
            this.isScrolling = false;
            raf$1.cancel(this.__dampScrollRafId);
            this.__stopScroll();
        };
        Content.prototype.snap = function () {
            var _this = this;
            if (this.__options.snap) {
                var xy = runTwice(function (i) {
                    return clamp_1(_this.xy[i], _this.minXY[i], _this.maxXY[i]);
                });
                this.dampScroll(xy);
            }
        };
        Content.prototype.moveTo = function (distXY) {
            var _this = this;
            clearTimeout(this.__scrollEndTimeId);
            var _a = this.__options, allow = _a.allow, overflowDistance = _a.overflowDistance;
            runTwice(function (i) {
                if (allow[i]) {
                    _this.xy[i] = clamp_1(distXY[i], _this.minXY[i] - overflowDistance, _this.maxXY[i] + overflowDistance);
                }
            });
            if (allow.includes(true)) {
                var _b = __read(this.xy, 2), x = _b[0], y = _b[1];
                var targets = this.targets;
                var target = targets[0];
                this.emit('scroll', { targets: targets, target: target, x: x, y: y });
                setTranslate.apply(void 0, __spread([this.el], this.xy));
            }
            return this.xy;
        };
        Content.prototype.scrollTo = function (distXY, duration, easing) {
            var _this = this;
            if (duration === void 0) { duration = 1000; }
            this.stop();
            this.isScrolling = true;
            var _a = __read(tween(this.xy, distXY, duration, easing), 3), run = _a[0], stop = _a[1], done = _a[2];
            run(this.moveTo.bind(this));
            this.__stopScroll = stop;
            done(function () {
                _this.snap();
                _this.isScrolling = false;
            });
        };
        Content.prototype.dampScroll = function (distXY) {
            if (distXY[0] === this.xy[0] && distXY[1] === this.xy[1])
                return;
            raf$1.cancel(this.__dampScrollRafId);
            var _a = this.__options, overflowDistance = _a.overflowDistance, allow = _a.allow;
            var _distXY = __spread(distXY);
            function _moveTo(context) {
                context.isScrolling = true;
                var xy = context.xy, __minXY = context.minXY, __maxXY = context.maxXY;
                var _nextXY = runTwice(function (i) {
                    var _nextvalue = damp(context.xy[i], _distXY[i]);
                    if (xy[i] >= __maxXY[i] + overflowDistance) {
                        _distXY[i] = __maxXY[i];
                    }
                    else if (xy[i] <= __minXY[i] - overflowDistance) {
                        _distXY[i] = __minXY[i];
                    }
                    else {
                        if (xy[i] === _distXY[i] && _nextvalue === _distXY[i]) {
                            if (xy[i] > __maxXY[i]) {
                                _distXY[i] = __maxXY[i];
                            }
                            else if (xy[i] < __minXY[i]) {
                                _distXY[i] = __minXY[i];
                            }
                        }
                        else {
                            return _nextvalue;
                        }
                    }
                    return damp(context.xy[i], _distXY[i]);
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
                    context.emit('scroll-end');
                }
            }
            _moveTo(this);
        };
        Content.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return Content;
    }(AnyEvent));

    var setTimeout$3 = window.setTimeout;
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
            _endTimeoutId = setTimeout$3(function () {
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

    var SCROLL_END_DELAY = 16;

    var setTimeout$2 = window.setTimeout;
    var DEFAULT_OPTIONS = {
        overflowDistance: 100,
        damping: 0.1,
        allow: [true, true],
        hideBar: [false, false],
        snap: true,
        hasBar: true,
        watchResize: true,
    };
    var plugins$1 = [];
    var default_1$2 = (function (_super) {
        __extends(default_1, _super);
        function default_1(el, options) {
            var _this = _super.call(this) || this;
            _this.targets = [];
            _this.__contentRefList = [];
            var at = new AnyTouch$1(el);
            _this.el = el;
            _this.options = __assign(__assign({}, DEFAULT_OPTIONS), options);
            var allow = _this.options.allow;
            setStyle(el, {
                position: "relative",
                overflow: 'hidden',
            });
            if (_this.options.watchResize) {
                var ro = new index(_this.update.bind(_this));
                ro.observe(el);
            }
            Array.from(el.children).forEach(function (contentEl) {
                var ref = new Content(contentEl, el, _this.options);
                ref.on('resize', function () {
                    _this.update();
                });
                ref.on('scroll', function (arg) {
                    clearTimeout(ref.__scrollEndTimeId);
                    _this.emit('scroll', arg);
                });
                ref.on('scroll-end', function (arg) {
                    _this.emit('scroll-end', arg);
                });
                _this.__contentRefList.push(ref);
            });
            _this.__currentContentRef = _this.getContentRef();
            plugins$1.forEach(function (plugin) {
                plugin(_this);
            });
            at.on('at:after', function (e) {
                _this.emit(e.type, e);
            });
            at.on(['panstart', 'panmove'], function (e) {
                var __currentContentRef = _this.__currentContentRef;
                if (null !== __currentContentRef) {
                    _this.targets = e.targets;
                    var deltaX = e.deltaX, deltaY = e.deltaY;
                    var xy = __currentContentRef.xy;
                    __currentContentRef.moveTo([xy[0] + deltaX, xy[1] + deltaY]);
                }
            });
            at.on('panend', function (e) {
                if (null === _this.__currentContentRef)
                    return;
                _this.__currentContentRef.__scrollEndTimeId = setTimeout$2(function () {
                    if (null !== _this.__currentContentRef) {
                        _this.targets = e.targets;
                        _this.emit('scroll-end', _this.__currentContentRef.xy);
                    }
                }, SCROLL_END_DELAY);
            });
            at.on('at:start', function (e) {
                var _a;
                _this.emit('at:start');
                var targetEl = e.target;
                _this.__currentContentRef = _this.__findContentRef(targetEl);
                (_a = _this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.stop();
            });
            at.on('at:end', function () {
                var _a;
                _this.emit('at:end');
                (_a = _this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.snap();
            });
            var swipe = at.get('swipe');
            swipe && swipe.set({ velocity: 1 });
            at.on('swipe', function (e) {
                var _a;
                _this.targets = e.targets;
                var deltaX = e.speedX * 200;
                var deltaY = e.speedY * 200;
                (_a = _this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.dampScroll([
                    _this.__currentContentRef.xy[0] + deltaX,
                    _this.__currentContentRef.xy[1] + deltaY,
                ]);
            });
            var wheelX = allow[0] && !allow[1];
            watchWheel(el, function (_a) {
                var type = _a.type, deltaY = _a.deltaY; _a.vx; var vy = _a.vy, target = _a.target;
                _this.__currentContentRef = _this.__findContentRef(target);
                if (null === _this.__currentContentRef)
                    return;
                var xy = _this.__currentContentRef.xy;
                _this.targets = [target];
                if ('start' === type) {
                    _this.__currentContentRef.stop();
                    if (wheelX) {
                        _this.dampScroll([xy[0] - deltaY, xy[1]]);
                    }
                    else {
                        _this.dampScroll([xy[0], xy[1] - deltaY]);
                    }
                }
                else if ('move' === type) {
                    if (wheelX) {
                        _this.dampScroll([xy[0] - deltaY, xy[1]]);
                    }
                    else {
                        _this.dampScroll([xy[0], xy[1] - deltaY]);
                    }
                }
                else if ('end' === type) {
                    if (wheelX) {
                        _this.dampScroll([xy[0] - vy * 5, xy[1]]);
                    }
                    else {
                        _this.dampScroll([xy[0], xy[1] - Math.ceil(vy) * 30]);
                    }
                }
            });
            return _this;
        }
        default_1.use = function (plugin) {
            plugins$1.push(plugin);
        };
        default_1.prototype.update = function () {
            this.__contentRefList.forEach(function (contentRef) {
                contentRef.update();
            });
            this.emit('resize');
        };
        default_1.prototype.__findContentRef = function (targetEl) {
            var e_1, _a;
            try {
                for (var _b = __values(this.__contentRefList), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var ref = _c.value;
                    if (ref.el.contains(targetEl)) {
                        this.emit('change-content', ref);
                        return ref;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        };
        default_1.prototype.moveTo = function (distXY) {
            var _a;
            return (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.moveTo(distXY);
        };
        default_1.prototype.scrollTo = function (distXY, duration, easing) {
            var _a;
            if (duration === void 0) { duration = 1000; }
            (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.scrollTo(distXY, duration, easing);
        };
        default_1.prototype.dampScroll = function (distXY) {
            var _a;
            (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.dampScroll(distXY);
        };
        default_1.prototype.stop = function () {
            var _a;
            (_a = this.__currentContentRef) === null || _a === void 0 ? void 0 : _a.stop();
        };
        default_1.prototype.getContentRef = function (elOrIndex) {
            if (void 0 === elOrIndex) {
                return this.__currentContentRef || this.__contentRefList[0];
            }
            if (0 !== elOrIndex && isElement_1(elOrIndex)) {
                return (this.__contentRefList.find(function (_a) {
                    var el = _a.el;
                    return el === elOrIndex;
                }) || null);
            }
            else {
                return this.__contentRefList[Number(elOrIndex)] || null;
            }
        };
        default_1.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        return default_1;
    }(AnyEvent));

    var Wrap = default_1$2;
    var plugins = [];
    var default_1$1 = (function (_super) {
        __extends(default_1, _super);
        function default_1(el, options) {
            var e_1, _a;
            var _this = _super.call(this, el, options) || this;
            try {
                for (var plugins_1 = __values(plugins), plugins_1_1 = plugins_1.next(); !plugins_1_1.done; plugins_1_1 = plugins_1.next()) {
                    var plugin = plugins_1_1.value;
                    plugin(_this);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (plugins_1_1 && !plugins_1_1.done && (_a = plugins_1.return)) _a.call(plugins_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return _this;
        }
        default_1.use = function (plugin) {
            plugins.push(plugin);
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

    var setTimeout$1 = window.setTimeout;
    function bar (wrapRef) {
        var allow = wrapRef.options.allow;
        var timeoutIds = [-1, -1];
        var __isDraggingBar = false;
        insertCss_2(BAR_CSS);
        var barRefs = runTwice(createBar);
        wrapRef.on(['at:start', 'scroll', 'resize'], function () {
            if (__isDraggingBar)
                return;
            updateBar(wrapRef, barRefs, allow);
        });
        wrapRef.on('change-content', function (ref) {
            updateBar(wrapRef, barRefs, allow);
        });
        function createBar(index) {
            var dir = [DIRECTION.X, DIRECTION.Y][index];
            var trackEl = createDOM(wrapRef.el, dir);
            var bar = new Wrap(trackEl, { allow: [DIRECTION.X === dir, DIRECTION.Y === dir], overflowDistance: 0 });
            setStyle(bar.el, { position: 'absolute', display: 'none' });
            bar.on('pan', function () {
                var thumb = bar.getContentRef();
                var contentRef = wrapRef.getContentRef();
                if (null !== contentRef) {
                    var xy = contentRef.xy;
                    var nextXY = __spread(xy);
                    nextXY[index] = -thumb.xy[index] * contentRef.contentSize[index] / thumb.wrapSize[index];
                    contentRef.moveTo(nextXY);
                    __isDraggingBar = true;
                }
            });
            bar.on('at:end', function () {
                __isDraggingBar = false;
            });
            return bar;
        }
        function updateBar(wrapRef, barRefs, allow) {
            var contentRef = wrapRef.getContentRef();
            var contentSize = contentRef.contentSize, wrapSize = contentRef.wrapSize, minXY = contentRef.minXY, maxXY = contentRef.maxXY;
            runTwice(function (i) {
                var _a;
                var barRef = barRefs[i];
                var trackElement = barRef.el;
                if (!allow[i]) {
                    return;
                }
                else {
                    changeDOMVisible(trackElement);
                }
                if (contentSize[i] > wrapSize[i]) {
                    changeOpacity(trackElement, 1);
                    clearTimeout(timeoutIds[i]);
                    timeoutIds[i] = setTimeout$1(function () {
                        changeOpacity(trackElement, 0);
                    }, 1000);
                    var thumbRef = barRefs[i].getContentRef();
                    if (null !== thumbRef) {
                        var _b = __read(calcBarXorY(contentRef.xy[i], wrapSize[i], contentSize[i], maxXY[i], minXY[i], thumbRef.minXY[i], thumbRef.maxXY[i]), 2), thumbSize = _b[0], thumbXorY = _b[1];
                        var thumbElement = barRef.getContentRef().el;
                        setStyle(thumbElement, (_a = {}, _a[['width', 'height'][i]] = thumbSize + "px", _a));
                        thumbRef.maxXY[i] = thumbRef.wrapSize[i] - thumbSize;
                        thumbRef.minXY[i] = 0;
                        var xy = thumbRef.xy;
                        xy[i] = thumbXorY;
                        thumbRef.moveTo(xy);
                    }
                }
                else {
                    changeOpacity(trackElement, 0);
                }
            });
        }
    }
    function createDOM(el, axis) {
        if (axis === void 0) { axis = DIRECTION.X; }
        var trackEl = createDOMDiv([TRACK_CLASS_NAME, TRACK_CLASS_NAME + "-" + axis]);
        var thumbEl = createDOMDiv([THUMB_CLASS_NAME, THUMB_CLASS_NAME + "-" + axis]);
        trackEl.appendChild(thumbEl);
        el.appendChild(trackEl);
        return trackEl;
    }
    function calcBarXorY(scrollViewXOrY, wrapSize, contentSize, maxXorY, minXorY, thumbMinXOrY, thumbMaxXOrY) {
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

    default_1$1.use(bar);
    var default_1 = (function (_super) {
        __extends(default_1, _super);
        function default_1(el, options) {
            return _super.call(this, el, options) || this;
        }
        return default_1;
    }(default_1$1));

    return default_1;

}));
