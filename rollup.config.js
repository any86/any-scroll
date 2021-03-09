const typescript = require('@rollup/plugin-typescript');
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
import { version } from './packages/core/package.json';

export default {
    input: './packages/any-scroll/src/index.ts',

    plugins: [
        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript'),
        }),
        nodeResolve(),
        commonjs(),
        json(),
        replace({
            __VERSION__: version,
            preventAssignment: true,
        }),
    ],
    // external: ['raf', 'any-touch'],
    output: [{
        // globals: { 'any-touch': 'AnyTouch',raf:'raf' },
        format: 'umd',
        name: 'anyScroll',
        file: `./packages/any-scroll/dist/any-scroll.umd.js`,
        sourcemap: false,
    }]
};