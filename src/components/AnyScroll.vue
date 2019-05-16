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
            type: Number,
            default: 0.1,
            validator: (v) => {
                return 0 < v && 1 > v;
            }
        },

        // 回弹距离
        bounceDistance: {
            type: Number,
            default: 150
        },

        // 回弹动画曲线
        easeFunction: {
            type: Function,
            default: (t) => (t - 1) ** 3 + 1
        },

        width: {
            type: Number
        },

        height: {
            type: Number,
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
        scrollTop: {
            get() {
                return -this.translateY;
            },

            set(scrollTop) {
                this.translateY = 0 - scrollTop;
            }
        },

        // X轴目标滚动条高度
        scrollLeft: {
            get() {
                return -this.translateX;
            },

            set(scrollLeft) {
                this.translateX = 0 - scrollLeft;
            }
        },

        // 在有回弹特效的情况下, 最小的scrollTop
        minScrollTopWithBounce() {
            return this.minScrollTop - this.bounceDistance;
        },

        // 在有回弹特效的情况下, 最小的scrollTop
        maxScrollTopWithBounce() {
            return this.maxScrollTop + this.bounceDistance;
        },

        // 在有回弹特效的情况下, 最小的scrollLeft
        minScrollLeftWithBounce() {
            return this.minScrollLeft - this.bounceDistance;
        },

        // 在有回弹特效的情况下, 最小的scrollLeft
        maxScrollLeftWithBounce() {
            return this.maxScrollLeft + this.bounceDistance;
        },

        // Y轴滚动的最小距离
        minScrollTop() {
            return 0;
        },

        // Y轴滚动的最远距离
        maxScrollTop() {
            return this.bodyHeight - this.viewHeight;
        },

        // X轴滚动的最小距离
        minScrollLeft() {
            return 0;
        },

        // X轴滚动的最远距离
        maxScrollLeft() {
            return this.bodyWidth - this.viewWidth;
        },

        map() {
            return { X: 'Left', Y: 'Top' };
        },

        // 是否超出顶部边界
        isOutOfTop() {
            return this.minScrollTop > this.scrollTop;
        },

        // 是否超出左侧边界
        isOutOfLeft() {
            return this.minScrollLeft > this.scrollLeft;
        },

        // 是否滚动条在最底端
        isOutOfBottom() {
            return this.maxScrollTop < this.scrollTop;
        },

        // 是否滚动条在最右端
        isOutOfRight() {
            return this.maxScrollLeft < this.scrollLeft;
        },

        // 是否超出顶部+弹簧边界
        isTouchTopBounce() {
            return this.minScrollTop - this.bounceDistance >= this.scrollTop;
        },

        // 是否超出左侧+弹簧边界
        isTouchLeftBounce() {
            return this.minScrollLeft - this.bounceDistance >= this.scrollLeft;
        },

        // 是否超出底部+弹簧边界
        isTouchBottomBounce() {
            return this.maxScrollTop + this.bounceDistance <= this.scrollTop;
        },

        // 是否超出右侧+弹簧边界
        isTouchRightBounce() {
            return this.maxScrollLeft + this.bounceDistance <= this.scrollLeft;
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
        isOutOfBounceX(isOutOfBounceX) {
            if (isOutOfBounceX) {
                // 吸附边缘
                this.snapToEdge('x');
            }
        },

        isOutOfBounceY(isOutOfBounceY) {
            if (isOutOfBounceY) {
                // 吸附边缘
                this.snapToEdge('y');
            }
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
        scrollTop(scrollTop) {
            // 响应弹簧的状态
            if (this.minScrollTop > scrollTop || this.maxScrollTop < scrollTop) {
                this.bounceYState = STATE_BOUNCE_GROW;
            } else {
                this.bounceYState = STATE_STATIC;
            }
            this.$emit('scroll', { scrollTop, scrollLeft: this.scrollLeft });
            // 监控scrollTop, 防止滑出有效区域
            // if (this.minScrollTopWithBounce > scrollTop) {
            //     this.scrollTop = this.minScrollTopWithBounce;
            // } else if (this.maxScrollTopWithBounce < scrollTop) {
            //     this.scrollTop = this.maxScrollTopWithBounce;
            // }
        },

        // 监控scrollLeft, 防止滑出有效区域
        scrollLeft(scrollLeft) {
            // 响应弹簧的状态
            if (this.minScrollLeft > scrollLeft || this.maxScrollLeft < scrollLeft) {
                this.bounceXState = STATE_BOUNCE_GROW;
            } else {
                this.bounceXState = STATE_STATIC;
            }
            this.$emit('scroll', { scrollLeft, scrollTop: this.scrollTop });
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
            // 滚动状态为静止
            this.scrollState = STATE_STATIC;
            // 弹簧"展开"状态的时候松手, 弹簧进入"收缩"状态
            if (STATE_BOUNCE_GROW === this.bounceXState) {
                this.bounceXState = STATE_BOUNCE_SHRINK;
                this.snapToEdge('x');
            }

            if (STATE_BOUNCE_GROW === this.bounceYState) {
                this.bounceYState = STATE_BOUNCE_SHRINK;
                this.snapToEdge('y');
            }
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
            this.viewWidth = this.$el.offsetWidth;
            this.viewHeight = this.$el.offsetHeight;
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
            if (STATE_BOUNCE_SHRINK === this.bounceXState || STATE_BOUNCE_SHRINK === this.bounceYState) return;
            this.scrollState = STATE_DRAG_SCROLL;
            this.scrollBy({ deltaX, deltaY });
        },

        /**
         * 移动body
         * @param {Object} 多拽产生的数据
         *  @param {Number} deltaX: x轴位移变化
         *  @param {Number} deltaY: y轴位移变化
         */
        scrollBy({ deltaX, deltaY }) {
            if (!this.overflowX) {
                this.translateX += deltaX;
            }

            if (!this.overflowY) {
                this.translateY += deltaY;
            }
        },

        /**
         * 滚动动画结束触发
         */
        scrollAnimateEndHandler() {
            if (this.scrollTop < this.minScrollTop) {
                this.translateY = 0;
            }
            this.$emit('scroll-animate-end');
        },

        /**
         * 拖拽松手后减速移动至停止
         * velocityX/Y的单位是px/ms
         */
        decelerate(ev) {
            this.stopScroll();
            if (STATE_BOUNCE_SHRINK === this.bounceXState || STATE_BOUNCE_SHRINK === this.bounceYState) return;
            this.scrollState = STATE_ANIMATE_SCROLL;
            const { speedX, speedY } = ev;
            const _calcDeltaDisplacement = (speed) => {
                // 根据速度求滑动距离
                // 此处的公式其实就是想让速度和距离有一个线性关系,
                // 并不是什么物理公式,
                // 此处的30也可以是其他任何值
                return (speed * 30) / this.damping;
            };

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
            raf.cancel(this.rafId);
            // 剩余滑动位移
            let remainDelta = { x: delta.x, y: delta.y };
            // 滑动到下一帧的scroll位置
            const _moveToNextFramePosition = () => {
                let willMove = { x: 0, y: 0 };
                // 过滤掉overflow限制的方向
                // 过滤掉超出弹簧边界移动的方向
                const axisGroup = ['x', 'y'].filter((axis) => !this[`overflow${axis.toUpperCase()}`]);
                // console.log(axisGroup, this[`isOutOfBounceY`], this[`isOutOfBounceX`]);

                axisGroup.forEach((axis) => {
                    // 如果有在边缘接线上, 那么剩余滑动距离置0
                    if (this[`isOutOfBounce${axis.toUpperCase()}`]) {
                        remainDelta[axis] = 0;
                    }
                    const currentRemain = ~~(remainDelta[axis] * (1 - this.damping));
                    willMove[axis] = remainDelta[axis] - currentRemain;
                    remainDelta[axis] = currentRemain;
                    this[`translate${axis.toUpperCase()}`] += willMove[axis];
                });

                // console.log(`willMove`, willMove, `remainDelta`, remainDelta);

                if (Math.abs(remainDelta.x) <= 1 && Math.abs(remainDelta.y) <= 1) {
                    this.scrollState = STATE_STATIC;
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
            const START_SCROLL_X = this.scrollLeft;
            const START_SCROLL_Y = this.scrollTop;
            const WILL_MOVE_X = left - START_SCROLL_X;
            const WILL_MOVE_Y = top - START_SCROLL_Y;
            const _toNextPosition = () => {
                const elapse = Date.now() - START_TIME;
                // 通过和1比较大小, 让easeFunction的返回值以1结束
                const progress = this.easeFunction(Math.min(1, elapse / duration));

                // 移动
                if (undefined !== top) {
                    this.scrollTop = Math.ceil(START_SCROLL_Y + WILL_MOVE_Y * progress);
                }

                if (undefined !== left) {
                    this.scrollLeft = Math.ceil(START_SCROLL_X + WILL_MOVE_X * progress);
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
                    this.scrollTo({ top: this.minScrollTop }, 300);
                } else if (this.isOutOfBottom) {
                    this.scrollTo({ top: this.maxScrollTop }, 300);
                }

                // 如果"拉伸"状态, 那么变为"收缩"状态
                if (STATE_BOUNCE_GROW === this.bounceYState) {
                    this.bounceYState = STATE_BOUNCE_SHRINK;
                }
            }

            // x轴
            if (undefined === axis || 'x' === axis) {
                if (this.isOutOfLeft) {
                    this.scrollTo({ left: this.minScrollLeft }, 300);
                } else if (this.isOutOfRight) {
                    this.scrollTo({ left: this.maxScrollLeft }, 300);
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
