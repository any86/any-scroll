<template>
<main>
  <head>
    <h1>
      {{scrollState}} /
      <small>{{bounceState}}</small>
    </h1>
  </head>

  <section class="body">
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

    <!-- 表单 -->
    <div class="form">
      <button @click="scrollUp">向上滑动</button>
      <button @click="scrollDown">向下滑动</button>
      <button @click="reset">复位</button>
      <button @click="test">测试</button>
    </div>
  </section>
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

        reset(callback) {
            this.$refs.scroll.scrollTo({ top: 0, left: 0, callback });
        },

        test() {
            this.reset();
            setTimeout(() => {
                this.$refs.scroll.scrollTo({ left: -200, top: 2700 });
                this.$refs.scroll.stopScroll();
                setTimeout(() => {
                    this.$refs.scroll.decelerate({ speedX: -0.1, speedY: -1 });
                }, 100);
            }, 1000);
        }
    }
};
</script>

<style lang="scss">
* {
    padding: 0;
    margin: 0;
}

h1 {
    font-size: 24px;
    background: rgba(#000, 0.5);
    width: 100%;
    color: #fff;
    text-align: center;
}

main {
    overflow: hidden;
    > .body {
        display: flex;
        > .scroll-view {
            width: 360px;
            flex-shrink: 0;
            margin: 5%;
            box-shadow: 1px 2px 3px rgba(#000, 0.1), -1px -2px 3px rgba(#000, 0.1);
        }

        > .form {
            margin: 5% auto;
            button {
                margin-top: 15px;
                margin-right: 15px;
                padding: 10px 30px;
                background: #69c;
                color: #fff;
                width:100%;
            }
        }
    }
}
</style>
