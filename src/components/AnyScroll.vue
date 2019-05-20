<template>
    <div :style="viewStyle" class="any-scroll-view">
        <div ref="body" :style="bodyStyle" class="any-scroll-view__body">
            <slot>内容为空</slot>
        </div>
    </div>
</template>

<script>
import {
    STATE_STATIC,
    STATE_DRAG_SCROLL,
    STATE_ANIMATE_SCROLL,
    STATE_BOUNCE_GROW,
    STATE_BOUNCE_SHRINK
} from '../const.js';
import AnyTouch from 'any-touch';
import raf from 'raf';
export default {
    name: 'any-scroll-view',

    props: {
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
            data: [],
            translateY: 0,
            translateX: 0,
            transitionDuration: 0,
            bodyHeight: 0,
            bodyWidth: 0,
            viewWidth: 0,
            viewHeight: 0,
            // 记录惯性滚动动画的id
            rafId: null,
            // scrollTo内容rafId
            scrollToRafId: null,
            // 滚动状态
            scrollState: STATE_STATIC,
            // 弹簧状态
            bounceXState: STATE_STATIC,
            bounceYState: STATE_STATIC
        };
    },

    computed: {
        viewStyle() {
            return { height: `${this.height}px`, width: this.width && `${this.width}px` };
        },

        bodyStyle() {
            return {
                transform: `translate3d(${this.translateX}px, ${this.translateY}px, 0px)`
                // transitionTimingFunction: this.bounceEase,
                // transitionDuration: `${this.transitionDuration}ms`
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
            return this.bodyHeight - this.viewHeight;
        },

        // X轴滚动的最小距离
        minScrollX() {
            return 0;
        },

        // X轴滚动的最远距离
        maxScrollX() {
            return this.bodyWidth - this.viewWidth;
        },

        map() {
            return { X: 'Left', Y: 'Top' };
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
        },

        // 是否超出顶部+弹簧边界
        isTouchTopBounce() {
            return this.minScrollY - this.bounceDistance >= this.scrollY;
        },

        // 是否超出左侧+弹簧边界
        isTouchLeftBounce() {
            return this.minScrollX - this.bounceDistance >= this.scrollX;
        },

        // 是否超出底部+弹簧边界
        isTouchBottomBounce() {
            return this.maxScrollY + this.bounceDistance <= this.scrollY;
        },

        // 是否超出右侧+弹簧边界
        isTouchRightBounce() {
            return this.maxScrollX + this.bounceDistance <= this.scrollX;
        },

        // 是否超出任何一个边界
        isTouchBounce() {
            return (
                this.isTouchTopBounce || this.isTouchRightBounce || this.isTouchLeftBounce || this.isTouchBottomBounce
            );
        },

        isOutOfBounceY() {
            return this.isTouchTopBounce || this.isTouchBottomBounce;
        },

        isOutOfBounceX() {
            return this.isTouchRightBounce || this.isTouchLeftBounce;
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

        scrollState(value) {
            this.$emit('scroll-state-change', value);
        },

        // 监控scrollTop, 防止滑出有效区域
        scrollY(scrollY, prevScrollY) {
            // 响应弹簧的状态
            if (this.minScrollY > scrollY || this.maxScrollY < scrollY) {
                if (prevScrollY < scrollY) {
                    this.bounceYState = STATE_BOUNCE_SHRINK;
                } else {
                    this.bounceYState = STATE_BOUNCE_GROW;
                }
            } else {
                this.bounceYState = STATE_STATIC;
            }
            this.$emit('scroll', { scrollY, scrollX: this.scrollX });
            // 监控scrollTop, 防止滑出有效区域
            // if (this.minScrollYWithBounce > scrollY) {
            //     this.scrollY = this.minScrollYWithBounce;
            // } else if (this.maxScrollYWithBounce < scrollY) {
            //     this.scrollY = this.maxScrollYWithBounce;
            // }
        },

        // 监控scrollLeft, 防止滑出有效区域
        scrollX(scrollX) {
            // 响应弹簧的状态
            if (this.minScrollX > scrollX || this.maxScrollX < scrollX) {
                this.bounceXState = STATE_BOUNCE_GROW;
            } else {
                this.bounceXState = STATE_STATIC;
            }
            this.$emit('scroll', { scrollX, scrollY: this.scrollY });
        }
    },

    mounted() {
        const at = new AnyTouch(this.$el);

        const MutationObserver = MutationObserver || WebKitMutationObserver || MozMutationObserver;
        const _observer = new MutationObserver(() => {
            this.updateSize();
        });

        _observer.observe(this.$refs.body, {
            subtree: true,
            childList: true
        });

        // this.updateSize();

        // 第一次触碰
        at.on('inputstart', (ev) => {
            this.stopScroll();
        });

        // 拖拽开始
        at.on('panstart', (ev) => {
            this.dragMove(ev);
        });

        // 拖拽中
        at.on('panmove', (ev) => {
            this.dragMove(ev);
        });

        // 结束拖拽
        at.on('panend', (ev) => {
            this.dropMove();
        });

        // 快速滑动
        at.on('swipe', (ev) => {
            this.decelerate(ev);
        });

        this.$on('hook:destroy', () => {
            at.destroy();
        });
    },

    methods: {
        updateSize() {
            this.viewWidth = this.width || this.$el.offsetWidth;
            this.viewHeight = this.height || this.$el.offsetHeight;
            this.bodyWidth = this.$refs.body.scrollWidth;
            this.bodyHeight = this.$refs.body.scrollHeight;
        },

        /**
         * 立即在当前位置停止滚动
         */
        stopScroll() {
            raf.cancel(this.rafId);
            this.scrollState = STATE_STATIC;
        },

        dragMove({ deltaX, deltaY }) {
            this.scrollState = STATE_DRAG_SCROLL;
            this.scrollBy({ deltaX, deltaY });
        },

        dropMove() {
            // 滚动状态为静止
            this.scrollState = STATE_STATIC;
            // 弹簧"展开"状态的时候松手, 弹簧进入"收缩"状态
            if (STATE_STATIC !== this.bounceXState) {
                this.bounceXState = STATE_BOUNCE_SHRINK;
                this.snapToEdge('x');
            }

            if (STATE_STATIC !== this.bounceYState) {
                this.bounceYState = STATE_BOUNCE_SHRINK;
                this.snapToEdge('y');
            }
        },

        /**
         * 移动body
         * @param {Object} 多拽产生的数据
         * @param {Object} 包含deltaX: x轴位移变化;deltaY: y轴位移变化
         */
        scrollBy(ev) {
            ['X', 'Y'].forEach((axis) => {
                if (!this[`overflow${axis}`]) {
                    let willScroll = this[`scroll${axis}`] - ev[`delta${axis}`];
                    console.log(willScroll);
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
         * 滚动动画结束触发
         */
        scrollAnimateEndHandler() {
            if (this.scrollY < this.minScrollY) {
                this.translateY = 0;
            }
            this.$emit('scroll-animate-end');
        },

        /**
         * 拖拽松手后减速移动至停止
         * velocityX/Y的单位是px/ms
         */
        decelerate(ev) {
            // raf.cancel(this.rafId);
            this.stopScroll();
            // 弹簧启用状态下, 不允许加速运动
            if (
                STATE_BOUNCE_GROW === this.bounceYState ||
                STATE_BOUNCE_GROW === this.bounceXState ||
                STATE_BOUNCE_SHRINK === this.bounceYState ||
                STATE_BOUNCE_SHRINK === this.bounceXState
            ) {
                return;
            }

            this.scrollState = STATE_ANIMATE_SCROLL;
            console.log(this.bounceYState, this.scrollState);

            const { speedX, speedY } = ev;
            const _calcDeltaDisplacement = (speed) => {
                // 根据速度求滑动距离
                // 此处的公式其实就是想让速度和距离有一个线性关系,
                // 并不是什么物理公式,
                // 此处的30也可以是其他任何值
                return ~~(speed * 30) / this.damping;
            };
            // console.clear();
            // 减速动画
            this._decelerateAnimation({
                x: _calcDeltaDisplacement(speedX),
                y: _calcDeltaDisplacement(speedY)
            });
        },

        /**
         * 减速动
         */
        _decelerateAnimation(delta) {
            let axisGroup = ['x', 'y'].filter((axis) => !this[`overflow${axis.toUpperCase()}`]);
            let isFinish = { x: false, y: false };
            raf.cancel(this.rafId);
            // 已经移动
            let hasMoved = { x: 0, y: 0 };
            // 剩余滑动位移
            let remainDistance = { x: delta.x, y: delta.y };
            // 滑动到下一帧的scroll位置
            const _moveToNextFramePosition = () => {
                let willMove = { x: 0, y: 0 };
                // 过滤掉overflow限制的方向
                // 过滤掉超出弹簧边界移动的方向
                for (let axis of axisGroup) {
                    if (isFinish[axis]) continue;
                    // 如果有在边缘接线上, 那么剩余滑动距离置0
                    // if (this[`isOutOfBounce${axis.toUpperCase()}`]) {
                    //     remainDistance[axis] = 0;
                    // }
                    // console.log(this[`scroll${axis.toUpperCase()}`] ,axis,`remainDistance[axis]`, remainDistance[axis])
                    const currentRemain = ~~(remainDistance[axis] * (1 - this.damping));
                    // 本次移动距离
                    willMove[axis] = currentRemain - remainDistance[axis];
                    hasMoved[axis] += willMove[axis];
                    // 待滑动距离
                    remainDistance[axis] = currentRemain;
                    // 滑动
                    this[`scroll${axis.toUpperCase()}`] += willMove[axis];
                    // console.log(axis,willMove[axis], this[`scroll${axis.toUpperCase()}`])
                    // 修正滑动, 限制在移动范围内
                    if (this[`minScroll${axis.toUpperCase()}WithBounce`] > this[`scroll${axis.toUpperCase()}`]) {
                        this[`scroll${axis.toUpperCase()}`] = this[`minScroll${axis.toUpperCase()}WithBounce`];
                        isFinish[axis] = true;
                        this.snapToEdge(axis);
                    } else if (this[`maxScroll${axis.toUpperCase()}WithBounce`] < this[`scroll${axis.toUpperCase()}`]) {
                        this[`scroll${axis.toUpperCase()}`] = this[`maxScroll${axis.toUpperCase()}WithBounce`];
                        isFinish[axis] = true;
                        this.snapToEdge(axis);
                    }
                    // 剩余滑动距离为0, 当前轴结束滑动
                    if (0 >= Math.abs(remainDistance[axis])) {
                        isFinish[axis] = true;
                    }
                }

                // 2个轴都结束滑动, 那么标记为"静止"
                if (isFinish.x && isFinish.y) {
                    this.$nextTick(() => {
                        this.scrollState = STATE_STATIC;
                    });
                } else {
                    this.rafId = raf(_moveToNextFramePosition);
                }
            };
            this.rafId = raf(_moveToNextFramePosition);
        },

        /**
         * 滑动动画结束后触发
         */
        afterAnimateScrollEnd() {},

        /**
         * 滚动指定位置
         */
        scrollTo({ top, left, callback = () => {} }, duration = 300) {
            // raf.cancel(this.scrollToRafId);
            const START_TIME = Date.now();
            const START_SCROLL_X = this.scrollX;
            const START_SCROLL_Y = this.scrollY;
            const WILL_MOVE_X = left - START_SCROLL_X;
            const WILL_MOVE_Y = top - START_SCROLL_Y;
            const _toNextPosition = () => {
                const elapse = Date.now() - START_TIME;
                // 通过和1比较大小, 让easeFunction的返回值以1结束
                const progress = this.easeFunction(Math.min(1, elapse / duration));

                // 移动
                if (undefined !== top) {
                    this.scrollY = Math.ceil(START_SCROLL_Y + WILL_MOVE_Y * progress);
                }

                if (undefined !== left) {
                    this.scrollX = Math.ceil(START_SCROLL_X + WILL_MOVE_X * progress);
                }
                // console.log({ rafId, progress });

                if (elapse <= duration) {
                    this.scrollToRafId = raf(_toNextPosition);
                } else {
                    callback();
                }
            };
            this.scrollToRafId = raf(_toNextPosition);
        },

        /**
         * 吸附最近的边界位置
         */
        snapToEdge(axis) {
            // y轴
            if (undefined === axis || 'y' === axis) {
                if (this.isOutOfTop) {
                    this.scrollTo({ top: this.minScrollY }, 300);
                } else if (this.isOutOfBottom) {
                    this.scrollTo({ top: this.maxScrollY }, 300);
                }

                // 如果"拉伸"状态, 那么变为"收缩"状态
                if (STATE_BOUNCE_GROW === this.bounceYState) {
                    this.bounceYState = STATE_BOUNCE_SHRINK;
                }
            }

            // x轴
            if (undefined === axis || 'x' === axis) {
                if (this.isOutOfLeft) {
                    this.scrollTo({ left: this.minScrollX }, 300);
                } else if (this.isOutOfRight) {
                    this.scrollTo({ left: this.maxScrollX }, 300);
                }

                // 如果"拉伸"状态, 那么变为"收缩"状态
                if (STATE_BOUNCE_GROW === this.bounceXState) {
                    this.bounceXState = STATE_BOUNCE_SHRINK;
                }
            }
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
    &__body {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
