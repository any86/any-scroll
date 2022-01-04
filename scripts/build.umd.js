const chalk = require('chalk');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const parseArgs = require('minimist')
const {
    terser
} = require('rollup-plugin-terser');
const {
    build
} = require('./build');
const { compress } = require('minimist')(process.argv.slice(2));

console.log(chalk.blue(`🤖 正在${compress ? '压缩' : '生成'}umd模块!`));

const options = {
    input: `./packages/any-scroll/src/index.ts`,
    output: {
        file: `./packages/any-scroll/dist/any-scroll.umd.js`,
        format: 'umd',
        sourcemap:true,
        name: 'AnyScroll',
    },
    tsConfig: {
        target: "ES5",
    },
    terser: terser({
        // include: [/^.+\.min\.js$/],
        output: {
            comments: false
        }
    }),

    prependPlugins: [nodeResolve(), commonjs()]
}
if (compress) {
    options.output.file = options.output.file.replace('.js', '.min.js');
}
build(options);