const shell = require('shelljs');
const chalk = require('chalk');
shell.cp('./README.md', './packages/any-scroll/')
console.log(chalk.green('复制MD文档到packages/any-scroll成功!'));