var ghpages = require('gh-pages');
const shell = require('shelljs');
const chalk = require('chalk');
const DIST_DIR = './example/';
// 发布
ghpages.publish(DIST_DIR, {
    branch: 'gh-pages',
}, (err) => {
    if(err) {
        console.log(chalk.red(err));
    } else {
        console.log(chalk.green('demo同步完成!'));
    }
});