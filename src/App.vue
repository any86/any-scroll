<template>
  <div class="any-scroll-view">
    <div ref="body" :style="bodyStyle" class="any-scroll-view__body">
       scrollTop: {{scrollTop}} | scrollLeft: {{scrollLeft}}</div>
  </div>
</template>

<script>
import AnyTouch from 'any-touch';
export default {
    name: 'any-scroll-view',

    props: {
        // 减速度, 单位px/s²
        acceleration: {
            type: Number,
            default: 3600
        }
    },

    data() {
        return {
            scrollTop: 0,
            scrollLeft: 0,
            transitionDuration: 300
        };
    },

    computed: {
        bodyStyle() {
            return {
                transitionDuration: `${this.transitionDuration}ms`,
                transform: `translate(${this.scrollLeft}px, ${
                    this.scrollTop
                }px)`
            };
        }
    },

    mounted() {
        const at = new AnyTouch(this.$el);

        // 第一次触碰
        at.on('inputstart', (ev) => {
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

        // 快速滑动
        at.on('swipe', (ev) => {
            this.decelerate(ev);
        });

        this.$on('hook:destroy', () => {
            at.destroy();
        });
    },

    methods: {
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
            this.moveTo({ scrollTop: y, scrollLeft: x });
        },

        /**
         * 移动body
         * @param {Object} 多拽产生的数据
         *  @param {Number} deltaX: x轴位移变化
         *  @param {Number} deltaY: y轴位移变化
         */
        move({ deltaX, deltaY }, transitionDuration = 0) {
            this.transitionDuration = transitionDuration;
            this.scrollLeft += deltaX;
            this.scrollTop += deltaY;
        },

        /**
         * 移动到
         */
        moveTo({ scrollTop, scrollLeft }, transitionDuration = 0) {
            this.transitionDuration = transitionDuration;
            this.scrollLeft = scrollLeft;
            this.scrollTop = scrollTop;
        },

        /**
         * 拖拽松手后减速移动至停止
         * velocityX/Y的单位是px/ms
         */
        decelerate(ev) {
            const directionSign = { up: -1, right: 1, down: 1, left: -1 }[
                ev.direction
            ];

            // Top? | Left?
            let SCROLL_SUFFIX = 'Top';
            // x ? | y?
            let AXIS_SUFFIX = 'Y';
            if (ev.velocityX > ev.velocityY) {
                SCROLL_SUFFIX = 'Left';
                AXIS_SUFFIX = 'X';
            }

            // 减速时间, 单位ms
            // t = (v₂ - v₁) / a
            const velocity = ev[`velocity${AXIS_SUFFIX}`];
            this.transitionDuration = Math.round(
                ((velocity * 1000) / this.acceleration) * 1000
            );

            // 滑动距离
            // s = (v₂² - v₁²) / (2 * a)
            const scrollAxis = `scroll${SCROLL_SUFFIX}`;
            this[scrollAxis] +=
                directionSign *
                Math.round(
                    Math.pow(velocity * 1000, 2) / (2 * this.acceleration)
                );
        }
    }
};
</script>

<style lang="scss">
body {
    padding: 0;
    margin: 0;
}

.any-scroll-view {
    position: relative;
    width: 100%;
    height: 90vh;
    overflow: hidden;

    &__body {
        transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
        background: #eee;
        position: absolute;
        width: 100%;
        height: 100%;
    }
}
</style>
