<template>
    <div>
        <div class="any-scroll__bar-x" :style="styleX"></div>
        <div class="any-scroll__bar-y" :style="styleY"></div>
    </div>
</template>

<script>
import { STATE_STATIC } from '@/const.js';
export default {
    name: 'ScrollBar',

    props: {
        scrollX: {
            type: Number
        },

        scrollY: {
            type: Number
        },

        scrollXState: {
            type: String
        },

        scrollYState: {
            type: String
        },

        contentWidth: {
            type: Number
        },

        contentHeight: {
            type: Number
        },

        viewWidth: {
            type: Number
        },

        viewHeight: {
            type: Number
        },

        // 短边
        width: {
            type: Number,
            default: 6
        },

        // 长边
        height: {
            type: Number,
            default: 6
        },

        color: {
            type: String,
            default: `rgba(0,0,0,0.4)`
        },

        isOutOfTop: {
            type: Boolean
        },

        isOutOfLeft: {
            type: Boolean
        },

        isOutOfRight: {
            type: Boolean
        },

        isOutOfBottom: {
            type: Boolean
        },

        minScrollX: {
            type: Number
        },

        maxScrollX: {
            type: Number
        },

        minScrollY: {
            type: Number
        },

        maxScrollY: {
            type: Number
        }
    },

    computed: {
        // x进度
        progressX() {
            return Math.round((this.scrollX / (this.contentWidth - this.viewWidth)) * 100);
        },

        // y进度
        progressY() {
            return Math.round((this.scrollY / (this.contentHeight - this.viewHeight)) * 100);
        },

        // 通用样式
        commonStyle() {
            return {
                backgroundColor: this.color,
                zIndex: 1986,
                position: 'absolute',
                transition: 'opacity 300ms'
            };
        },

        // x轴滚动条样式
        styleX() {
            return {
                ...this.commonStyle,
                opacity: STATE_STATIC === this.scrollXState ? 0 : 1,
                borderRadius: `${this.height}px`,
                bottom: 0,
                left: `${this.progressX}%`,
                height: `${this.height}px`,
                width: `${this.viewWidth * 0.2}px`,
                transform: `translateX(${0 - this.progressX}%)`
            };
        },

        // y轴滚动条样式
        styleY() {
            const progress = Math.max(0, this.progressY);
            const scale =
                this.isOutOfTop || this.isOutOfBottom
                    ? this.viewHeight / (this.viewHeight + Math.abs(this.scrollY))
                    : 1;

            const transformOrigin = this.isOutOfTop;
            return {
                ...this.commonStyle,
                opacity: STATE_STATIC === this.scrollYState ? 0 : 1,
                borderRadius: `${this.width}px`,
                top: `${progress}%`,
                right: 0,
                height: `${this.viewHeight * 0.2}px`,
                width: `${this.width}px`,
                transform: `translateY(${0 - progress}%) scaleY(${scale})`,
                transformOrigin: this.isOutOfTop ? 'top' : 'bottom'
            };
        }
    }
};
</script>
