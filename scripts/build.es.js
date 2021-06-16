const chalk = require('chalk');
const {
    terser
} = require('rollup-plugin-terser');
const {build,walkPackageDirs} = require('./build');

console.log(chalk.blue('正在生成es模块!'));
walkPackageDirs((dirName) => {
    build({
        input: `./packages/${dirName}/src/index.ts`,
        output: {
            file: `./packages/${dirName}/dist/index.es.js`,
            format: 'esm',
        },
        external: id => ['any-event', 'any-touch', 'tslib','insert-css','raf','lodash/clamp'].includes(id) || /^@/.test(id),
        tsConfig: {
            target: 'ES5',
            module: "ESNEXT",
        }
    });
});