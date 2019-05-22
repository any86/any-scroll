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
            isSnappingX: false,
            isSnappingY: false,
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
            scrollXState: STATE_STATIC,
            scrollYState: STATE_STATIC,
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

        isOutOfX() {
            return this.isOutOfLeft || this.isOutOfRight;
        },

        isOutOfY() {
            return this.isOutOfTop || this.isOutOfBottom;
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

        scrollXState(value) {
            if (STATE_STATIC === this.scrollXState) {
                this.snapToEdge('x');
            }
            this.$emit('scroll-x-state-change', value);
        },

        scrollYState(value) {
            if (STATE_STATIC === this.scrollYState) {
                this.snapToEdge('y');
            }
            this.$emit('scroll-y-state-change', value);
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
            raf.cancel(this.scrollToRafId);
            raf.cancel(this.rafId);
            this.scrollXState = STATE_STATIC;
            this.scrollYState = STATE_STATIC;
        },

        dragMove({ deltaX, deltaY }) {
            if (0 !== deltaX) {
                this.scrollXState = STATE_DRAG_SCROLL;
            }

            if (0 !== deltaY) {
                this.scrollYState = STATE_DRAG_SCROLL;
            }

            this.scrollBy({ deltaX, deltaY });
        },

        dropMove() {
            // 滚动状态为静止
            this.scrollXState = STATE_STATIC;
            this.scrollYState = STATE_STATIC;
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
            console.clear();
            console.log(this.bounceYState, this.scrollYState);

            this.stopScroll();
            // 弹簧启用状态下, 不允许加速运动
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
                x: _calcDeltaDisplacement(this.isOutOfX ? 0 : speedX),
                y: _calcDeltaDisplacement(this.isOutOfY ? 0 : speedY)
            });
        },

        /**
         * 减速动
         */
        _decelerateAnimation(delta) {
            raf.cancel(this.rafId);
            let axisGroup = ['x', 'y'].filter((axis) => !this[`overflow${axis.toUpperCase()}`]);
            let isFinish = { x: 0 === delta.x, y: 0 === delta.y };
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
                    if (isFinish[axis]) {
                        this[`scroll${axis.toUpperCase()}State`] = STATE_STATIC;
                        continue;
                    }
                    const currentRemain = ~~(remainDistance[axis] * (1 - this.damping));
                    // 本次移动距离
                    willMove[axis] = currentRemain - remainDistance[axis];
                    if (0 !== willMove[axis]) {
                        this[`scroll${axis.toUpperCase()}State`] = STATE_ANIMATE_SCROLL;
                    }
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
                        this[`scroll${axis.toUpperCase()}State`] = STATE_STATIC;
                    } else if (this[`maxScroll${axis.toUpperCase()}WithBounce`] < this[`scroll${axis.toUpperCase()}`]) {
                        this[`scroll${axis.toUpperCase()}`] = this[`maxScroll${axis.toUpperCase()}WithBounce`];
                        isFinish[axis] = true;
                        this[`scroll${axis.toUpperCase()}State`] = STATE_STATIC;
                    }
                    // 剩余滑动距离为0, 当前轴结束滑动
                    if (0 >= Math.abs(remainDistance[axis])) {
                        isFinish[axis] = true;
                    }
                }

                // 2个轴都结束滑动, 那么标记为"静止"
                if (isFinish.x && isFinish.y) {
                    this.$nextTick(() => {
                        this.scrollXState = STATE_STATIC;
                        this.scrollYState = STATE_STATIC;
                    });
                } else {
                    this.rafId = raf(_moveToNextFramePosition);
                }
            };
            this.rafId = raf(_moveToNextFramePosition);
        },

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
            if (WILL_MOVE_X) {
                this.scrollXState = STATE_ANIMATE_SCROLL;
            }

            if (WILL_MOVE_Y) {
                this.scrollYState = STATE_ANIMATE_SCROLL;
            }
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
                    this.scrollXState = STATE_STATIC;
                    this.scrollYState = STATE_STATIC;
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
                // if(this.isSnappingY) return;
                this.isSnappingY = true;

                if (this.isOutOfTop) {
                    this.scrollTo(
                        {
                            top: this.minScrollY,
                            callback: () => {
                                this.isSnappingY = false;
                            }
                        },
                        300
                    );
                } else if (this.isOutOfBottom) {
                    this.scrollTo(
                        {
                            top: this.maxScrollY,
                            callback: () => {
                                this.isSnappingY = false;
                            }
                        },
                        300
                    );
                } else {
                    this.isSnappingY = false;
                }
            }

            // x轴
            if (undefined === axis || 'x' === axis) {
                this.isSnappingX = true;
                if (this.isOutOfLeft) {
                    this.scrollTo(
                        {
                            left: this.minScrollX,
                            callback: () => {
                                this.isSnappingY = false;
                            }
                        },
                        300
                    );
                } else if (this.isOutOfRight) {
                    this.scrollTo(
                        {
                            left: this.maxScrollX,
                            callback: () => {
                                this.isSnappingY = false;
                            }
                        },
                        300
                    );
                } else {
                    this.isSnappingX = false;
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
