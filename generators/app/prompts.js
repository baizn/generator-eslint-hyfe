var Inquirer = require('inquirer')

module.exports = [
    {
        type: 'input',
        message: '请输入扫描结果报告主题: ',
        name: 'reportTitle',
        default: 'XXX项目JS代码扫描结果报告',
    },
    {
        type: 'input',
        name: 'inputPath',
        message: '请输入要扫描的项目路径(默认为当前目录): ',
        default: process.cwd(),
        //记住用户喜好
        store: true
    }, 
    {
        type: 'input',
        message: '请输入扫描结果输出目录路径(默认为当前目录下output): ',
        name: 'outputPath'
    },
    {
        type: 'checkbox',
        message: '是否过滤一下目录',
        name: 'filterPath',
        choices: [
            new Inquirer.Separator(' ----- 可过滤目录 -----'),
            {
                name: 'node_modules'
            },
            {
                name: 'test'
            }
        ]
    },
    {
        type: 'confirm',
        name: 'action',
        message: '确定输入无误?'
    }
];
