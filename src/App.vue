<template>
    <main>
        <h1>
            {{scrollState}} /
            <small>{{bounceState}}</small>
        </h1>
        <any-scroll
            ref="scroll"
            :height="600"
            @change-bounce-state="bounceState=$event"
            @change-scroll-state="scrollState=$event"
            class="scroll-view"
        >
            <ul>
                <li v-for="({title, author}, index) in data" :key="title+index">
                    <img :src="author.avatar_url">
                    {{index}} - {{title}}
                </li>
            </ul>
        </any-scroll>

        <button @click="scrollUp">向上滑动</button>
        <button @click="scrollDown">向下滑动</button>
        <button @click="reset">复位</button>
        <button @click="test">测试</button>
    </main>
</template>

<script>
import AnyScroll from './components/AnyScroll';
export default {
    name: 'App',

    components: { AnyScroll },

    data() {
        return { data: [], bounceState: 'static', scrollState: 'static' };
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
            this.$refs.scroll.scrollTo({ left: -200, top: 2700 });
            // this.$refs.scroll.stopScroll();
            // this.$refs.scroll.decelerate({ speedX: -0.1, speedY: -0.3});
        }
    }
};
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
}

.scroll-view {
    border-bottom: 10px solid #444;
}
h1 {
    font-size: 24px;
    position: fixed;
    background: rgba(#000, 0.5);
    z-index: 999;
    width: 100%;
    color: #fff;
    text-align: center;
}
button {
    margin-top: 15px;
    margin-right: 15px;
    padding: 10px 30px;
    background: #69c;
    color: #fff;
}
</style>
