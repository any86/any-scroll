<template>
    <main>
        <header>
            <h1>AnyScroll</h1>
        </header>

        <article class="body">
            <article class="props-form">
                <h1>设置</h1>

                <label>
                    height(高度)
                    <input v-model="height" placeholder="scrollView的高度">
                </label>

                <label>
                    width(宽度)
                    <input v-model="width" placeholder="不指定宽度, 默认100%;">
                </label>

                <label>
                    bounceDistance(可拉伸距离)
                    <input v-model="bounceDistance">
                </label>

                <label class="inline">
                    overflowX(禁止x轴运动)
                    <input type="checkbox" v-model="overflowX">
                </label>

                <label class="inline">
                    overflowY(禁止y轴运动)
                    <input type="checkbox" v-model="overflowY">
                </label>
            </article>

            <any-scroll
                ref="scroll"
                :width="width"
                :height="height"
                :overflow-x="overflowX"
                :overflow-y="overflowY"
                :bounce-distance="bounceDistance"
                @change-bounce-state="bounceState=$event"
                @change-scroll-state="scrollState=$event"
                @scroll="scrollHandler"
                class="scroll-view"
            >
                <ul>
                    <li v-for="({title, author}, index) in data" :key="title+index">
                        <img :src="author.avatar_url">
                        {{index}} - {{title}}
                    </li>
                </ul>
            </any-scroll>

            <!-- data -->
            <article class="dataAndMethods">
                <table>
                    <tr>
                        <td>弹簧状态</td>
                        <td>{{bounceState}}</td>
                    </tr>
                    <tr>
                        <td>滚动状态</td>
                        <td>{{scrollState}}</td>
                    </tr>

                    <tr>
                        <td>scrollLeft</td>
                        <td>{{scrollLeft}}</td>
                    </tr>

                    <tr>
                        <td>scrollTop</td>
                        <td>{{scrollTop}}</td>
                    </tr>
                </table>

                <!-- 表单 -->
                <div class="form">
                    <button @click="scrollUp">向上滑动</button>
                    <button @click="scrollDown">向下滑动</button>
                    <button @click="reset">复位</button>
                    <button @click="test">测试</button>
                </div>
            </article>
        </article>
    </main>
</template>

<script>
import AnyScroll from './components/AnyScroll';
export default {
    name: 'App',

    components: { AnyScroll },

    data() {
        return {
            data: [],
            height: 600,
            width:undefined,
            bounceDistance: 150,
            overflowX: false,
            overflowY: false,
            scrollTop: 0,
            scrollLeft: 0,
            bounceState: '静止',
            scrollState: '静止'
        };
    },

    async mounted() {
        const resp = await fetch('db.json');
        const { data } = await resp.json();
        this.data = data.slice(0, 66);
        this.$nextTick();
        console.log('nextTick');
        this.$refs.scroll.updateSize();
    },

    methods: {
        scrollHandler({ scrollTop, scrollLeft }) {
            this.scrollLeft = scrollLeft;
            this.scrollTop = scrollTop;
        },
        scrollUp() {
            this.$refs.scroll.stopScroll();
            this.$refs.scroll.decelerate({ speedX: 0, speedY: 4 });
        },

        scrollDown() {
            this.$refs.scroll.stopScroll();
            this.$refs.scroll.decelerate({ speedX: 0, speedY: -4 });
        },

        reset() {
            this.$refs.scroll.scrollTo({ top: 0, left: 0 });
        },

        test() {
            this.$refs.scroll.scrollTo({ left: 0, top: 2700 });
            this.$refs.scroll.stopScroll();
            setTimeout(() => {
                this.$refs.scroll.decelerate({ speedX: 0.1, speedY: -1 });
            }, 2000);
        }
    }
};
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
}

main {
    overflow: hidden;

    > header {
        h1 {
            width: 100%;
            text-align: center;
            padding: 15px;
        }
    }

    > article.body {
        display: flex;
        padding: 2%;

        > .props-form {
            flex: 1;
            padding: 15px;
            border: 1px solid #eee;
            box-shadow: 1px 2px 3px rgba(#000, 0.1);
            label {
                display: flex;
                margin-top: 15px;
                align-content: center;
                align-items: center;
                padding: 0 5px;
                word-break: keep-all;
                input {
                    margin-left: 10px;
                    outline: none;
                    width: 100%;
                    padding: 10px;
                    box-sizing: border-box;
                    font-size: 14px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
            }
        }

        > .scroll-view {
            width: 360px;
            flex-shrink: 0;
            margin-left: 2%;
            box-shadow: 1px 2px 3px rgba(#000, 0.1), -1px -2px 3px rgba(#000, 0.1);
                    ul {
            width: 950vw;
            min-width: 100vw;
        }
        li {
            box-sizing: border-box;
            font-size: 16px;
            list-style-type: none;
            padding: 15px;
            margin: 0;
            border-bottom: 1px solid #ddd;
            background: #ddd;
            display: flex;
            align-items: center;
            img {
                width: 30px;
                height: 30px;
                margin-right: 10px;
            }
            &:nth-child(2n + 1) {
                background: #fff;
            }
        }
        }

        > .dataAndMethods {
            flex: 1;
            margin-left: 2%;
            padding: 0 2%;

            table {
                padding: 10px;
                border-spacing: 0;
                box-shadow: 1px 2px 3px rgba(#000, 0.1);
                border: 1px solid rgba(#000, 0.1);
                width: 100%;
                tr {
                    td {
                        padding: 10px;
                        line-height: 1.5;
                        text-align: start;
                        border-bottom: 1px solid transparent;
                        color: #000;
                        &:nth-child(1) {
                            min-width: 150px;
                        }
                    }

                    &:hover {
                        td {
                            transform: translateX(15px);
                            transition: transform 600ms;
                        }
                    }

                    &:nth-of-type(odd) {
                        background: #eee;
                    }
                }
            }

            button {
                margin-top: 15px;
                margin-right: 15px;
                padding: 10px 30px;
                background: #69c;
                color: #fff;
                width: 100%;
            }
        }
    }
}
</style>
