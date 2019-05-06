<template>
    <div class="any-scroll-view">
        <div
            ref="body"
            :style="bodyStyle"
            class="any-scroll-view__body"
            @transitionend="transitionendHandler"
        >
            <slot>
                <ul>
                    <li v-for="({title}, index) in data" :key="index">{{index}} - {{title}}</li>
                </ul>
            </slot>
        </div>
    </div>
</template>

<script>
import AnyTouch from 'any-touch';
import * as acc from './utils/acceleration';
import raf from 'raf';
export default {
    name: 'any-scroll-view',

    props: {
        // 回弹距离
        bounceDistance: {
            type: Number,
            default: 100
        },

        height: {
            type: Number,
            default: 500
        },

        // 减速度, 单位px/s²
        acceleration: {
            type: Number,
            default: 7200
        },

        // 滑动动画的最大执行时间
        maxScrollAnimateTime: {
            type: Number,
            default: 2000
        }
    },

    data() {
        return {
            data: [],
            translateY: 0,
            translateX: 0,
            transitionDuration: 2000,
            bodyHeight: 0,
            bodyWidth: 0,
            viewWidth: 0,
            viewHeight: 0,
            // 实时scroll
            scrollTop: 0,
            scrollLeft: 0,
            // 定时器句柄
            rafId: []
        };
    },

    computed: {
        bodyStyle() {
            return {
                transitionDuration: `${this.transitionDuration}ms`,
                transform: `translate3d(${this.translateX}px, ${
                    this.translateY
                }px,0)`
            };
        },

        // Y轴目标滚动条高度
        willScrollTop() {
            return -this.translateY;
        },

        // X轴目标滚动条高度
        willScrollLeft() {
            return -this.translateX;
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

        // 是否滚动条在最顶端
        isInTopEdge() {
            return 0 === this.scrollTop;
        },

        // 是否滚动条在最左端
        isInLeftEdge() {
            return 0 === this.scrollLeft;
        },

        // 是否滚动条在最底端
        isInBottomEdge() {
            return this.maxScrollTop === this.scrollTop;
        },

        // 是否滚动条在最右端
        isInRightEdge() {
            return this.maxScrollLeft === this.scrollLeft;
        }
    },

    async mounted() {
        const resp = await fetch('https://cnodejs.org/api/v1/topics?limit=300');
        const { data } = await resp.json();
        this.data = data;
        await this.$nextTick();

        const at = new AnyTouch(this.$el);
        this.updateSize();
        // 第一次触碰
        at.on('inputstart', (ev) => {
            this.cancelScrollLive();
            this.stopRoll();
        });

        // 拖拽开始
        at.on('panstart', (ev) => {
            this.move(ev);
        });

        // 拖拽中
        at.on('panmove', (ev) => {
            this.move(ev);
        });

        // 结束拖拽
        at.on('panend', (ev) => {
            // this.resetPosition();
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

        // https://github.com/nolimits4web/Swiper/blob/master/src/utils/utils.js#L25
        getCurrentTranslate() {
            const style = getComputedStyle(this.$refs.body, null);
            const { transform } = style;
            const array = transform.match(/(\-?)(\d)+(\.\d{0,})?/g);
            return { x: Math.round(array[4]), y: Math.round(array[5]) };
        },

        /**
         * 立即在当前位置停止滚动
         */
        stopRoll() {
            const { x, y } = this.getCurrentTranslate();
            this.moveTo({ translateY: y, translateX: x });
        },

        /**
         * 移动body
         * @param {Object} 多拽产生的数据
         *  @param {Number} deltaX: x轴位移变化
         *  @param {Number} deltaY: y轴位移变化
         */
        move({ deltaX, deltaY }, transitionDuration = 0) {
            this.transitionDuration = transitionDuration;
            this.translateX += deltaX;
            this.translateY += deltaY;
            this.stopScrollWhenTouchEdge();
            this.refreshScrollData(this.translateX, this.translateY);
        },

        /**
         * 移动到
         */
        moveTo({ translateY, translateX }, transitionDuration = 0) {
            this.transitionDuration = transitionDuration;
            this.translateX = translateX;
            this.translateY = translateY;
            this.stopScrollWhenTouchEdge();
            this.refreshScrollData(this.translateX, this.translateY);
        },

        /**
         * 拖拽松手后减速移动至停止
         * velocityX/Y的单位是px/ms
         */
        decelerate(ev) {
            const { direction } = ev;
            const directionSign = { up: -1, right: 1, down: 1, left: -1 }[
                direction
            ];
            // 判断是那个轴的运动
            const axis = ev.velocityX > ev.velocityY ? 'X' : 'Y';

            const velocity = ev[`velocity${axis}`];

            console.log({ velocity });

            // 滑动距离
            let distance = Math.round(
                acc.s({ a: this.acceleration, vt: velocity * 1000, v0: 0 })
            );
            // 通过方向判断最大可移动距离
            if ('up' === direction) {
                distance = Math.min(
                    distance,
                    this.maxScrollTop - this.scrollTop
                );
            } else if ('down' === direction) {
                distance = Math.min(
                    distance,
                    this.scrollTop - this.minScrollTop
                );
            } else if ('right' === direction) {
                distance = Math.min(
                    distance,
                    this.scrollLeft - this.minScrollLeft
                );
            } else if ('left' === direction) {
                distance = Math.min(
                    distance,
                    this.maxScrollLeft - this.scrollLeft
                );
            }

            this[`translate${axis}`] += directionSign * distance;

            // 如果终点超过边界, 那么求到达边界的速度
            const vt = acc.vt({
                a: this.acceleration,
                s: distance,
                v0: velocity
            });

            // 用到达边界的速度, 求运动时间, 单位ms
            this.transitionDuration =
                acc.t({ vt, v0: velocity, a: this.acceleration }) * 1000;

            this.stopScrollWhenTouchEdge();

            // 不如将要移动的方向上还有可移动距离
            // 开始监听translate的变化
            const edgeNameMap = {
                up: 'Bottom',
                down: 'Up',
                left: 'Right',
                right: 'Left'
            };
            if (!this[`isIn${edgeNameMap[direction]}Edge`]) {
                this.setScrollLive();
            }
        },

        /**
         * 滚动的边界限制
         * bounceDistance会参与计算
         */
        stopScrollWhenTouchEdge() {
            for (let axis in this.map) {
                const direction = this.map[axis];
                if (
                    this[`minScroll${direction}`] - this.bounceDistance >
                    this[`willScroll${direction}`]
                ) {
                    this[`translate${axis}`] =
                        this.bounceDistance - this[`minScroll${direction}`];
                } else if (
                    this[`maxScroll${direction}`] + this.bounceDistance <
                    this[`willScroll${direction}`]
                ) {
                    this[`translate${axis}`] =
                        0 - this[`maxScroll${direction}`] - this.bounceDistance;
                }
            }
        },

        /**
         * 刷新scroll信息
         */
        refreshScrollData(translateX, translateY) {
            this.scrollTop = this.minScrollTop - translateY;
            this.scrollLeft = this.minScrollTop - translateX;
        },

        /**
         * 页面滚动过程中, 实时返回scroll数据
         */
        setScrollLive() {
            // 定时刷新scroll信息
            this.cancelScrollLive();
            const refreshScrollData = () => {
                const { x, y } = this.getCurrentTranslate();
                this.refreshScrollData(x, y);
                this.rafId = raf(refreshScrollData);
            };
            this.rafId = raf(refreshScrollData);
        },

        /**
         * 实时返回scroll数据
         */
        cancelScrollLive() {
            raf.cancel(this.rafId);
        },

        transitionendHandler() {
            this.cancelScrollLive();
        },

        /**
         * 恢复到0,0位置
         */
        resetPosition() {
            this.moveTo(
                {
                    translateX: 0 - this.minScrollLeft,
                    translateY: 0 - this.minScrollTop
                },
                500
            );
        }
    }
};
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
}

.any-scroll-view {
    position: relative;
    width: 100%;
    height: 90vh;
    overflow: hidden;
    border-bottom: 2px solid #f10;
    &__body {
        transition-timing-function: cubic-bezier(0.18, 0.84, 0.44, 1);
        background: #eee;
        position: absolute;
        ul {
            width: 350vw;
        }
        li {
            box-sizing: border-box;
            font-size: 16px;
            list-style-type: none;
            padding: 15px;
            margin: 0;
            border-bottom: 1px solid #ddd;
            background: #ddd;
            &:nth-child(2n + 1) {
                background: #fff;
            }
        }
    }
}
</style>
