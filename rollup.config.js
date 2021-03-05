const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
import {version} from './packages/core/package.json';

export default {
    input: './packages/any-scroll/src/index.ts',

    plugins: [
        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript'),
        }),
        json(),
        replace({
            __VERSION__: version,
            preventAssignment:true,
        })
    ],

    output: [{
        format: 'umd',
        name: 'anyScroll',
        file: `./packages/any-scroll/dist/any-scroll.umd.js`,
        sourcemap: false,
    }]
};