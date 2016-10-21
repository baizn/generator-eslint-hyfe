
module.exports = [
  {
    type: 'input',
    message: '请输入扫描结果报告主题: ',
    name: 'reportTitle',
    default: 'XXX项目JS代码扫描结果报告',
  },
  {
    type: 'confirm',
    name: 'es6more',
    message: '是否使用ES6/7语法?',
    store: true,
    default: true
  },
  {
    type: 'confirm',
    name: 'isReact',
    message: '是否是React项目?',
    store: true
  },
  {
    type: 'confirm',
    name: 'isJsx',
    message: '是否使用JSX?',
    store: true
  },
  {
    type: 'input',
    name: 'inputPath',
    message: '请输入要扫描的项目目录(默认为当前目录): ',
    default: process.cwd()
  }, 
  {
    type: 'input',
    message: '请输入扫描结果输出目录路径(默认为当前目录下reports): ',
    name: 'outputPath',
    default: process.cwd()
  },
  {
    type: 'checkbox',
    message: '是否可过滤以下目录, 请选择',
    name: 'filterPath',
    choices: [
      {
        value: '^node_modules$',
        name: 'node_modules',
        checked: true
      },
      {
        value: '^build$',
        name: 'build',
        checked: true
      },
      {
        value: '^dist$',
        name: 'dist',
        checked: true
      },
      {
        value: '^public$',
        name: 'public',
        checked: true
      },
      {
        value: '^logs?$',
        name: 'log(s)',
        checked: true
      },
      {
        value: '^reports$',
        name: 'reports',
        checked: true
      },
      {
        value: '^tests?$',
        name: 'test(s)'
      },
      {
        value: '^docs?$',
        name: 'doc(s)'
      },
      {
        value: '^examples?$',
        name: 'example(s)'
      },
      {
        value: '^install$',
        name: 'install'
      },
      {
        value: '^data$',
        name: 'data'
      }
    ]
  },
  {
    type: 'confirm',
    name: 'file',
    message: '是否过滤以.开头的文件或文件夹?',
    default: true
  },
  {
    type: 'confirm',
    name: 'action',
    message: '确定输入无误?'
  }
]
