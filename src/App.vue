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

        // 滑动动画的最大执行时间
        maxScrollAnimateTime: {
            type: Number,
            default: 2000
        },

        // 缓动函数
        easing: {
            type: Function,
            default: (t) => (t - 1) ** 3 + 1
        },

        overflowX: {
            type: Boolean,
            default: true
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
            transitionDuration: 2000,
            bodyHeight: 0,
            bodyWidth: 0,
            viewWidth: 0,
            viewHeight: 0,
            // 实时scroll
            scrollTop: 0,
            scrollLeft: 0,
            // 定时器句柄
            rafId: [],

            rafEaseId: null
        };
    },

    computed: {
        bodyStyle() {
            return {
                transform: `translate3d(${this.translateX}px, ${
                    this.translateY
                }px, 0px)`
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
        const resp = await fetch('db.json');
        const { data } = await resp.json();
        this.data = data;
        await this.$nextTick();

        const at = new AnyTouch(this.$el);
        this.updateSize();

        // 第一次触碰
        at.on('inputstart', (ev) => {
            this.stopScroll();
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
            // this.resetScroll();
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
            raf.cancel(this.rafEaseId);
        },

        /**
         * 移动body
         * @param {Object} 多拽产生的数据
         *  @param {Number} deltaX: x轴位移变化
         *  @param {Number} deltaY: y轴位移变化
         */
        move({ deltaX, deltaY }, transitionDuration = 0) {
            this.transitionDuration = transitionDuration;
            if (!this.overflowX) {
                this.translateX += deltaX;
            }

            if (!this.overflowY) {
                this.translateY += deltaY;
            }
            this.stopScrollWhenTouchEdge();
            this.refreshScrollData(this.translateX, this.translateY);
        },

        /**
         * 滚动动画结束触发
         */
        scrollAnimateEndHandler() {
            console.log(this.scrollTop);
            if (this.scrollTop < this.minScrollTop) {
                this.translateY = 0;
                console.log('resetScroll');
                // this.resetScroll();
            }
            console.log('scroll-animate-end')
            this.$emit('scroll-animate-end');
        },

        /**
         * 移动到
         */
        moveTo({ scrollTop, scrollLeft }, duration = 0) {
            raf.cancel(this.rafEaseId);
            const startScrollLeft = this.scrollLeft;
            const startScrollTop = this.scrollTop;
            const distance = Math.max(scrollTop, -this.bounceDistance) - startScrollTop;
            // 开始时间点
            let startTime = Date.now();

            const getDistance = () => {
                const elapse = Date.now() - startTime;
                if (duration <= elapse) {
                    this.scrollAnimateEndHandler();
                    return;
                }
                let delta = 
                    this.easing(elapse / duration) * distance
                ;
                console.log({delta, distance});
                delta = Math.round(delta);

                if (Math.abs(delta) >= Math.abs(distance)) {
                    delta = distance;
                    this.scrollAnimateEndHandler();
                    return;
                }

                if (!this.overflowX) {
                    this.scrollLeft = startScrollLeft + delta;
                    this.translateX = 0 - this.scrollLeft;
                }
                if (!this.overflowY) {
                    this.scrollTop = startScrollTop + delta;
                    this.translateY = 0 - this.scrollTop;
                }

                this.stopScrollWhenTouchEdge();

                this.$emit('scroll', {
                    scrollTop: this.scrollTop,
                    scrollLeft: this.scrollLeft
                });
                this.rafEaseId = raf(getDistance);
            };
            this.rafEaseId = raf(getDistance);
        },

        /**
         * 拖拽松手后减速移动至停止
         * velocityX/Y的单位是px/ms
         */
        decelerate(ev) {
            const { direction } = ev;
            const directionSign = { up: 1, right: -1, down: -1, left: 1 }[
                direction
            ];
            // 判断是那个轴的运动
            const axis = ev.velocityX > ev.velocityY ? 'X' : 'Y';

            const velocity = ev[`velocity${axis}`];
            const time = Math.max(768, velocity * 256);

            const willMove = (directionSign * velocity * time) / 2;
            this.moveTo({ scrollTop: this.scrollTop + willMove }, time);
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

        transitionendHandler() {
            this.cancelScrollLive();
        },

        /**
         * 恢复到0,0位置
         */
        resetScroll() {
            this.moveTo({ scrollTop: 0, scrollLeft: 0 });
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
        // transition-timing-function: cubic-bezier(0.18, 0.84, 0.44, 1);
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
