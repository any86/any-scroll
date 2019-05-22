<template>
    <div :style="viewStyle" class="any-scroll-view">
        <!-- <h1>{{scrollToRafId}} | {{rafId}}</h1> -->
        <div ref="content" :style="contentStyle" class="any-scroll-view__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import {
    STATE_STATIC,
    STATE_DRAG_SCROLL,
    STATE_ANIMATE_SCROLL,
    STATE_BOUNCE_STRETCHED,
    STATE_BOUNCE_SHRINK
} from '../const.js';
import AnyTouch from 'any-touch';
import raf from 'raf';
export default {
    name: 'any-scroll-view',

    props: {
        hasRipple: {
            type: Boolean,
            default: true
        },
        // 速度衰减因子
        damping: {
            type: [Number, String],
            default: 0.1,
            validator: (v) => {
                return 0 < v && 1 > v;
            }
        },

        // 回弹距离
        bounceDistance: {
            type: [Number, String],
            default: 150
        },

        // 回弹动画时间
        bounceTime: {
            type: [String, Number],
            default: 500
        },

        // 回弹动画曲线
        easeFunction: {
            type: Function,
            default: (t) => (t - 1) ** 3 + 1
        },

        width: {
            type: [Number, String]
        },

        height: {
            type: [Number, String],
            default: 500
        },

        overflowX: {
            type: Boolean,
            default: false
        },

        overflowY: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            translateY: 0,
            translateX: 0,
            transitionDuration: 0,
            contentHeight: 0,
            contentWidth: 0,
            viewWidth: 0,
            viewHeight: 0,
            viewTop: 0,
            viewLeft: 0,
            // 记录惯性滚动动画的id
            rafId: null,
            // scrollTo内容rafId
            scrollToRafId: null,
            // 滚动状态
            scrollXState: STATE_STATIC,
            scrollYState: STATE_STATIC,
            // 弹簧状态
            bounceXState: STATE_STATIC,
            bounceYState: STATE_STATIC,
        };
    },

    computed: {
        viewStyle() {
            return { height: `${this.height}px`, width: this.width && `${this.width}px` };
        },

        contentStyle() {
            return {
                transform: `translate3d(${this.translateX}px, ${this.translateY}px, 0px)`
            };
        },

        // Y轴目标滚动条高度
        scrollY: {
            get() {
                return -this.translateY;
            },

            set(scrollY) {
                this.translateY = 0 - scrollY;
            }
        },

        // X轴目标滚动条高度
        scrollX: {
            get() {
                return -this.translateX;
            },

            set(scrollX) {
                this.translateX = 0 - scrollX;
            }
        },

        // 在有回弹特效的情况下, 最小的scrollTop
        minScrollYWithBounce() {
            return this.minScrollY - Number(this.bounceDistance);
        },

        // 在有回弹特效的情况下, 最小的scrollTop
        maxScrollYWithBounce() {
            return this.maxScrollY + Number(this.bounceDistance);
        },

        // 在有回弹特效的情况下, 最小的scrollLeft
        minScrollXWithBounce() {
            return this.minScrollX - Number(this.bounceDistance);
        },

        // 在有回弹特效的情况下, 最小的scrollLeft
        maxScrollXWithBounce() {
            return this.maxScrollX + Number(this.bounceDistance);
        },

        // Y轴滚动的最小距离
        minScrollY() {
            return 0;
        },

        // Y轴滚动的最远距离
        maxScrollY() {
            return this.contentHeight - this.viewHeight;
        },

        // X轴滚动的最小距离
        minScrollX() {
            return 0;
        },

        // X轴滚动的最远距离
        maxScrollX() {
            return this.contentWidth - this.viewWidth;
        },

        // 是否超出顶部边界
        isOutOfTop() {
            return this.minScrollY > this.scrollY;
        },

        // 是否超出左侧边界
        isOutOfLeft() {
            return this.minScrollX > this.scrollX;
        },

        // 是否滚动条在最底端
        isOutOfBottom() {
            return this.maxScrollY < this.scrollY;
        },

        // 是否滚动条在最右端
        isOutOfRight() {
            return this.maxScrollX < this.scrollX;
        }
    },

    watch: {
        width() {
            this.updateSize();
        },

        height() {
            this.updateSize();
        },

        bounceXState(x) {
            this.$emit('bounce-state-change', { x, y: this.bounceYState });
        },

        bounceYState(y) {
            this.$emit('bounce-state-change', { x: this.bounceXState, y });
        },

        scrollXState(value) {
            this.$emit('scroll-state-change', { x: value, y: this.scrollYState });
        },

        scrollYState(value) {
            this.$emit('scroll-state-change', { y: value, x: this.scrollXState });
        },

        // 监控scrollTop, 防止滑出有效区域
        scrollY(scrollY) {
            this.watchScrollXYHandler('Y', scrollY);
        },

        // 监控scrollLeft, 防止滑出有效区域
        scrollX(scrollX) {
            this.watchScrollXYHandler('X', scrollX);
        }
    },

    mounted() {
        const at = new AnyTouch(this.$el);

        const MutationObserver = MutationObserver || WebKitMutationObserver || MozMutationObserver;
        const _observer = new MutationObserver(() => {
            this.updateSize();
        });

        _observer.observe(this.$refs.content, {
            subtree: true,
            childList: true
        });

        // 第一次触碰
        at.on('inputstart', (ev) => {
            this.stopScroll();
        });

        // 拖拽开始
        at.on('panstart', (ev) => {
            console.warn('panstart');
            this.panstartHandler(ev);
        });

        // 拖拽中
        at.on('panmove', (ev) => {
            this.panmoveHandler(ev);
        });

        // 结束拖拽
        at.on('panend', (ev) => {
            this.panendHandler();
            console.warn('panend');
        });

        // 快速滑动
        at.on('swipe', (ev) => {
            console.log('swipe');
            this.decelerate(ev);
        });

        this.$on('hook:destroy', () => {
            at.destroy();
        });
    },

    methods: {
        /**
         * 通过观察scroll的值
         */
        watchScrollXYHandler(axis, scrollPosition) {
            // 响应弹簧的状态
            if (this[`minScroll${axis}`] > scrollPosition || this[`maxScroll${axis}`] < scrollPosition) {
                // SHRINK状态在snap函数中处理
                if (STATE_BOUNCE_SHRINK !== this[`bounce${axis}State`]) {
                    this[`bounce${axis}State`] = STATE_BOUNCE_STRETCHED;
                }
            } else {
                this[`bounce${axis}State`] = STATE_STATIC;
            }
            this.$emit('scroll', { scrollTop: this.scrollY, scrollLeft: this.scrollX });
        },

        updateSize() {
            this.viewWidth = this.width || this.$el.offsetWidth;
            this.viewHeight = this.height || this.$el.offsetHeight;
            this.contentWidth = this.$refs.content.scrollWidth;
            this.contentHeight = this.$refs.content.scrollHeight;
        },

        /**
         * 立即在当前位置停止滚动
         */
        stopScroll() {
            raf.cancel(this.scrollToRafId);
            raf.cancel(this.rafId);
            this.scrollXState = STATE_STATIC;
            this.scrollYState = STATE_STATIC;
        },

        panstartHandler({ deltaX, deltaY, x, y }) {
            this.dragMoveContent({ deltaX, deltaY });
        },

        panmoveHandler({ deltaX, deltaY }) {
            this.dragMoveContent({ deltaX, deltaY });
        },

        /**
         * 拖拽内容
         */
        dragMoveContent({ deltaX, deltaY }) {
            if (0 !== deltaX) {
                this.scrollXState = STATE_DRAG_SCROLL;
            }

            if (0 !== deltaY) {
                this.scrollYState = STATE_DRAG_SCROLL;
            }

            this.scrollBy({ deltaX, deltaY });
        },

        panendHandler() {
            // this.q = { x: undefined, y: undefined };

            // 滚动状态为静止
            this.scrollXState = STATE_STATIC;
            this.scrollYState = STATE_STATIC;
            this.snapToEdge();
        },

        /**
         * 移动content
         * @param {Object} 多拽产生的数据
         * @param {Object} 包含deltaX: x轴位移变化;deltaY: y轴位移变化
         */
        scrollBy(ev) {
            ['X', 'Y'].forEach((axis) => {
                if (!this[`overflow${axis}`]) {
                    let willScroll = this[`scroll${axis}`] - ev[`delta${axis}`];
                    if (this[`maxScroll${axis}WithBounce`] < willScroll) {
                        willScroll = this[`maxScroll${axis}WithBounce`];
                    } else if (this[`minScroll${axis}WithBounce`] > willScroll) {
                        willScroll = this[`minScroll${axis}WithBounce`];
                    }
                    this[`scroll${axis}`] = willScroll;
                }
            });
        },

        /**
         * 拖拽松手后减速移动至停止
         * velocityX/Y的单位是px/ms
         */
        decelerate(ev) {
            console.warn('decelerate', this.bounceXState, this.bounceYState);

            raf.cancel(this.rafId);
            // this.scrollXState = STATE_STATIC;
            // this.scrollYState = STATE_STATIC;

            const { speedX, speedY } = ev;
            const _calcDeltaDisplacement = (speed) => {
                // 根据速度求滑动距离
                // 此处的公式其实就是想让速度和距离有一个线性关系,
                // 并不是什么物理公式,
                // 此处的30也可以是其他任何值
                return ~~(speed * 30) / this.damping;
            };
            // 减速动画
            // 弹簧shrink状态下,对应轴线, 不允许加速运动
            this._decelerateAnimation({
                x: _calcDeltaDisplacement(STATE_BOUNCE_SHRINK === this.bounceXState ? 0 : speedX),
                y: _calcDeltaDisplacement(STATE_BOUNCE_SHRINK === this.bounceYState ? 0 : speedY)
            });
        },

        /**
         * 减速动
         */
        _decelerateAnimation(delta) {
            raf.cancel(this.rafId);
            let isFinish = { x: 0 === delta.x, y: 0 === delta.y };
            let AXIS_LIST = ['x', 'y'].filter((axis) => !this[`overflow${axis.toUpperCase()}`] && !isFinish[axis]);
            // 已经移动
            // let hasMoved = { x: 0, y: 0 };
            // 剩余滑动位移
            let remainDistance = { x: delta.x, y: delta.y };
            console.log(remainDistance, `remainDistance`);
            // 滑动到下一帧的scroll位置
            const _moveToNextFramePosition = () => {
                // 过滤掉overflow限制的方向
                // 过滤掉超出弹簧边界移动的方向
                for (let axis of AXIS_LIST) {
                    const AXIS = axis.toUpperCase();
                    // 如果已经完成滑动, 那么标记为静止, 不再参与滑动计算
                    if (isFinish[axis]) {
                        this[`scroll${AXIS}State`] = STATE_STATIC;
                        continue;
                    }
                    // 本次减少后剩余距离
                    const currentRemain = ~~(remainDistance[axis] * (1 - this.damping));
                    // 本次移动距离
                    const willMove = currentRemain - remainDistance[axis];
                    if (0 === willMove) {
                        isFinish[axis] = true;
                        this[`scroll${AXIS}State`] = STATE_STATIC;
                    } else {
                        this[`scroll${AXIS}State`] = STATE_ANIMATE_SCROLL;
                        // 待滑动距离
                        remainDistance[axis] = currentRemain;
                        // this.q[axis] = this.q[axis] || 0;
                        // this.q[axis] -= willMove;
                        // console.log(JSON.stringify(this.q));
                        // hasMoved[axis] += willMove;
                        // 滑动
                        this[`scroll${AXIS}`] += willMove;
                    }

                    // console.log(axis,willMove, this[`scroll${AXIS}`])
                    // 修正滑动, 限制在移动范围内
                    if (this[`minScroll${AXIS}WithBounce`] > this[`scroll${AXIS}`]) {
                        this[`scroll${AXIS}`] = this[`minScroll${AXIS}WithBounce`];
                        isFinish[axis] = true;
                    } else if (this[`maxScroll${AXIS}WithBounce`] < this[`scroll${AXIS}`]) {
                        this[`scroll${AXIS}`] = this[`maxScroll${AXIS}WithBounce`];
                        isFinish[axis] = true;
                    }
                }

                if (isFinish.x) {
                    this.scrollXState = STATE_STATIC;
                    if (STATE_BOUNCE_SHRINK !== this.bounceXState) {
                        console.log('减速snapX');
                        this.snapToEdge('x');
                    }
                }

                if (isFinish.y) {
                    this.scrollYState = STATE_STATIC;
                    if (STATE_BOUNCE_SHRINK !== this.bounceYState) {
                        console.log('减速snapY');

                        this.snapToEdge('y');
                    }
                }

                // 2个轴都结束滑动, 那么标记为"静止"
                if (!isFinish.x || !isFinish.y) {
                    this.rafId = raf(_moveToNextFramePosition);
                }
            };
            _moveToNextFramePosition();
        },

        /**
         * 滚动指定位置
         */
        scrollTo({ top, left, callback = () => {} }, duration = 300) {
            const START_TIME = Date.now();
            const DIST_SCROLL = { X: left, Y: top };
            const START_SCROLL = {};
            const WILL_MOVE = {};
            const AXIS_LIST = [undefined !== top && 'Y', undefined !== left && 'X'].filter((axis) => !!axis);
            for (let axis of AXIS_LIST) {
                START_SCROLL[axis] = this[`scroll${axis}`];
                WILL_MOVE[axis] = DIST_SCROLL[axis] - START_SCROLL[axis];
                this[`scroll${axis}State`] = WILL_MOVE[axis] ? STATE_ANIMATE_SCROLL : STATE_STATIC;
            }

            if (0 === AXIS_LIST.length) return;

            const _toNextPosition = () => {
                const elapse = Date.now() - START_TIME;
                // 通过和1比较大小, 让easeFunction的返回值以1结束
                const progress = this.easeFunction(Math.min(1, elapse / duration));

                // 移动

                for (let axis of AXIS_LIST) {
                    this[`scroll${axis}`] = Math.ceil(START_SCROLL[axis] + WILL_MOVE[axis] * progress);
                }

                if (elapse <= duration) {
                    this.scrollToRafId = raf(_toNextPosition);
                } else {
                    // 因为是根据时间运动, 所以一定是同时到达
                    for (let axis of AXIS_LIST) {
                        if (WILL_MOVE[axis]) {
                            this[`scroll${axis}State`] = STATE_STATIC;
                        }
                    }
                    callback();
                }
            };

            // raf.cancel(this.scrollToRafId);
            this.scrollToRafId = raf(_toNextPosition);
        },

        /**
         * 吸附最近的边界位置
         * @param {String} 轴线,'x' | 'y'
         */
        snapToEdge(axis) {
            const POS = {
                x: undefined,
                y: undefined
            };
            const AXIS_LIST = undefined === axis ? ['x', 'y'] : [axis];
            console.log(AXIS_LIST, `snap`);

            AXIS_LIST.forEach((axis) => {
                const AXIS_UPPERCASE = axis.toUpperCase();
                if (this[`minScroll${AXIS_UPPERCASE}`] > this[`scroll${AXIS_UPPERCASE}`]) {
                    this[`bounce${AXIS_UPPERCASE}State`] = STATE_BOUNCE_SHRINK;
                    POS[axis] = this[`minScroll${AXIS_UPPERCASE}`];
                } else if (this[`maxScroll${AXIS_UPPERCASE}`] < this[`scroll${AXIS_UPPERCASE}`]) {
                    this[`bounce${AXIS_UPPERCASE}State`] = STATE_BOUNCE_SHRINK;
                    POS[axis] = this[`maxScroll${AXIS_UPPERCASE}`];
                }
            });
            console.log('POS', POS);
            this.scrollTo(
                {
                    top: POS.y,
                    left: POS.x,
                    callback: () => {
                        this.bounceXState = STATE_STATIC;
                        this.bounceYState = STATE_STATIC;
                    }
                },
                this.bounceTime
            );
        }
    }
};
</script>

<style lang="scss">
.any-scroll-view {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    h1 {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999999;
    }
    &__content {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
