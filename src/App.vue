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
          <li v-for="n in 100" :key="n">
            第{{n}}行
            , scrollTop: {{scrollTop}} | scrollLeft: {{scrollLeft}}
          </li>
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
        height: {
            type: Number,
            default: 500
        },

        // 减速度, 单位px/s²
        acceleration: {
            type: Number,
            default: 3600
        }
    },

    data() {
        return {
            translateY: 0,
            translateX: 0,
            transitionDuration: 300,
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
                transform: `translate(${this.translateX}px, ${
                    this.translateY
                }px)`
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

        map(){
            return { X: 'Left', Y: 'Top' };
        },

        // 是否滚动条在最顶端
        isInTopEdge(){
            return 0 === this.scrollTop;
        },

        // 是否滚动条在最左端
        isInLeftEdge(){
            return 0 === this.scrollLeft;
        },


        // 是否滚动条在最底端
        isInBottomEdge(){
            return this.maxScrollTop === this.scrollTop;
        },

        // 是否滚动条在最右端
        isInRightEdge(){
            return this.maxScrollLeft === this.scrollLeft;
        }
    },

    mounted() {
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

        // 快速滑动
        at.on('swipe', (ev) => {
            if (0 < this.scrollTop) {
                this.decelerate(ev);
            }
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
            const {direction} = ev;
            const directionSign = { up: -1, right: 1, down: 1, left: -1 }[direction];
            // 判断是那个轴的运动
            const axis = ev.velocityX > ev.velocityY ? 'X' : 'Y';

            // 减速时间, 单位ms
            // t = (v₂ - v₁) / a
            const velocity = ev[`velocity${axis}`];
            this.transitionDuration = Math.round(
                ((velocity * 1000) / this.acceleration) * 1000
            );

            // 滑动距离
            // s = (v₂² - v₁²) / (2 * a)
            this[`translate${axis}`] +=
                directionSign *
                Math.round(
                    Math.pow(velocity * 1000, 2) / (2 * this.acceleration)
                );

            this.stopScrollWhenTouchEdge();

            // 不如将要移动的方向上还有可移动距离
            // 开始监听translate的变化
            const edgeNameMap = {up: 'Bottom', down:'Up', left: 'Right', right: 'Left'};
            console.warn(direction);
            console.warn(`isIn${edgeNameMap[direction]}Edge`);
            if(!this[`isIn${edgeNameMap[direction]}Edge`]){
                this.setScrollLive();
            }
        },

        /**
         * 滚动的边界限制
         */
        stopScrollWhenTouchEdge() {
            for (let axis in this.map) {
                const direction = this.map[axis];
                if (this[`minScroll${direction}`] > this[`willScroll${direction}`]) {
                    this[`translate${axis}`] = 0 - this[`minScroll${direction}`];
                } else if (this[`maxScroll${direction}`] < this[`willScroll${direction}`]) {
                    this[`translate${axis}`] = 0 - this[`maxScroll${direction}`];
                }
            }
        },

        /**
         * 刷新scroll信息
         */
        refreshScrollData(translateX, translateY) {
            this.scrollTop = 0 - translateY;
            this.scrollLeft = 0 - translateX;
        },

        /**
         * 页面滚动过程中, 实时返回scroll数据
         */
        setScrollLive() {
            // 定时刷新scroll信息
            this.cancelScrollLive();
            const refreshScrollData = () => {
                const { x, y } = this.getCurrentTranslate();
                console.log(y);
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
            console.log('transitionendHandler');
            this.cancelScrollLive();
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
        transition-timing-function: ease-out;
        background: #eee;
        position: absolute;
        ul {
            width: 150vw;
        }
        li {
            font-size: 14px;
            list-style-type: none;
            padding: 15px;
            margin: 0;
            border-bottom: 1px solid #ddd;
        }
    }
}
</style>
