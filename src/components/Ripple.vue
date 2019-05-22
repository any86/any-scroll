<template>
    <svg
        :viewBox="`0 0 ${viewWidth} ${viewHeight}`"
        xmlns="http://www.w3.org/2000/svg"
        :style="svgStyle"
    >
        <path
            v-if="undefined !== startQ.x"
            :d="d"
            :style="{fill:`rgba(0,0,0,${opacity})`}"
            :class="{animated}"
        >{{startQ}}| {{state}}</path>
    </svg>
</template>

<script>
export default {
    name: 'ripple',

    props: {
        maxOpacity: {
            type: Number,
            default: 0.2
        },

        minOpacity: {
            type: Number,
            default: 0.05
        },

        align: {
            type: String,
            default: 'top',
            validator: (align) => ['top', 'left', 'right', 'bottom'].includes(align)
        },

        // 控制点
        q: {
            type: Object
        },

        // 拉伸最大长度
        maxDistance: {
            type: Number,
            default: 80
        }
    },

    computed: {
        opacity() {
            return this.minOpacity + this.maxOpacity * this.progress;
        },

        // 当前距离和最大距离的比例
        progress() {
            return this.distance / this.maxDistance;
        },

        distance() {
            switch (this.align) {
                case 'top': {
                    return Math.min(this.maxDistance, (this.q.y || 0) - (this.startQ.y||0));
                    // return 0 - Math.max(0 - this.maxDistance, this.startQ.y - (this.q.y || 0));
                }

                case 'left': {
                    // return 0 - Math.max(0 - this.maxDistance, this.startQ.x - this.q.x || 0);
                    return Math.min(this.maxDistance, this.q.x - this.startQ.x || 0);
                }

                case 'right': {
                    return Math.min(this.maxDistance, this.startQ.x - this.q.x || 0);
                }

                case 'bottom': {
                    return Math.min(this.maxDistance, this.startQ.y - this.q.y || 0);
                }
            }
        },

        d() {
            switch (this.align) {
                case 'top': {
                    const qx = this.q.x || 0;
                    const qy = Math.min(this.viewHeight, (this.q.y || 0) - this.startQ.y);
                    return `M0 0 Q${qx} ${qy} ${this.viewWidth} 0`;
                }

                case 'left': {
                    const qx = Math.min((this.q.x || 0) - this.startQ.x, this.viewWidth);
                    const qy = this.q.y || 0;
                    return `M0 0 Q${qx} ${qy}  0 ${this.viewHeight}`;
                }

                case 'right': {
                    const qx = this.viewWidth - this.distance;
                    const qy = this.q.y || 0;
                    return `M${this.viewWidth} 0 Q${qx} ${qy}  ${this.viewWidth} ${this.viewHeight}`;
                }

                case 'bottom': {
                    const qx = this.q.x || 0;
                    const qy = this.viewHeight - this.distance;
                    return `M0 ${this.viewHeight} Q${qx} ${qy}  ${this.viewWidth} ${this.viewHeight}`;
                }
            }
        }
    },

    data() {
        return {
            viewWidth: 0,
            viewHeight: 0,
            animated: false,
            svgStyle: {},
            state: 'end',
            startQ: { x: undefined, y: undefined },
            viewTop: 0,
            viewLeft: 0
        };
    },

    watch: {
        q: {
            // immediate: true,
            deep: true,
            handler(q, prevQ) {
                if ('end' === this.state) {
                    this.state = 'start';
                    this.startQ = { ...q };
                    this.animated = false;
                } else {
                    if (undefined === q.x) {
                        this.state = 'end';
                        this.animated = true;
                    } else {
                        this.state = 'move';
                        this.animated = false;
                    }
                }
            }
        },

        align() {
            this.update();
        }
    },

    mounted() {
        this.update();
    },

    methods: {
        update() {
            const parentHeight = this.$el.parentElement.offsetHeight;

            switch (this.align) {
                case 'top': {
                    this.viewWidth = this.$el.parentElement.offsetWidth;
                    this.viewHeight = this.maxDistance;
                    this.svgStyle = { top: 0, left: 0, width: this.viewWidth, height: this.viewHeight };
                    break;
                }
                case 'left': {
                    this.viewWidth = this.maxDistance;
                    this.viewHeight = this.$el.parentElement.offsetHeight;
                    this.svgStyle = { top: 0, left: 0, width: this.viewWidth, height: this.viewHeight };
                    break;
                }

                case 'right': {
                    this.viewWidth = this.maxDistance;
                    this.viewHeight = this.$el.parentElement.offsetHeight;
                    this.svgStyle = { top: 0, right: 0, width: this.viewWidth, height: this.viewHeight };
                    break;
                }

                case 'bottom': {
                    this.viewWidth = this.$el.parentElement.offsetWidth;
                    this.viewHeight = this.maxDistance;
                    this.viewTop = parentHeight - this.viewHeight;
                    this.svgStyle = { bottom: 0, left: 0, width: this.viewWidth, height: this.viewHeight };
                    break;
                }
            }
            // this.viewHeight = this.$el.parentElement.offsetHeight;
        }
    }
};
</script>

<style lang="scss">
svg {
    position: absolute;
    z-index: 9999;
}
.animated {
    transition: all 0.5s;
}
</style>
