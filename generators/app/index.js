
require('colors')
var generator = require('yeoman-generator')
var path = require('path')
var fs = require('fs')
var prompts = require('./prompts')
var plato = require('plato-zh')
var hyfeRules = require('eslint-config-hyfe')

//var SPLIT_COUNT = 25
/**
 * 执行顺序：
 *  1 initializing - Your initialization methods
 *  2 prompting - Where you prompt users for options
 *  3 configuring - Saving configurations and configure the project
 *  4 default - If the method name doesn't match a priority, it will be pushed to this group
 *  5 writing - Where you write the generator specific files
 *  6 conflicts - Where conflicts are handled
 *  7 install - Where installation are run
 *  8 end - Called last, cleanup, say good bye
 */
module.exports = generator.Base.extend({
  constructor: function() {
    generator.Base.apply(this, arguments)
    this.params = {}
    this.stdouts = {}
  },

  prompting: {
    questions: function () {
      var next = this.async()
      this.log(' ')
      this.log(('友情提示：所选项目文件内容不要过大, 以防内存溢出(nodejs在64位系统下默认只有1.4G左右内存)！').red.bold)
      this.log(' ')
      return this.prompt(prompts).then(function (answers) {      
        if(!answers.action) {
          this.log('\033[31m 终止扫描' + answers.inputPath + '项目\033[39m\n')
          return false
        }
        this.log(' ')
        this.log(('正在扫描检测' + answers.inputPath + '项目中的JavaScript文件，请稍后...').yellow.bold)
        this.log(' ')
        this.params = answers
               
        next()
      }.bind(this)) 
    }
  },

  checkingFiles: function() {
    var self = this

    var filePath = this.params.inputPath || process.cwd()

    var fileterFolders = this.params.filterPath
    var filterFile = this.params.file
    if(filterFile) {
      fileterFolders.push('(^\\.[_a-zA-Z0-9+])')
    }
    var reg = new RegExp(fileterFolders.join('|'), 'i')

    var allJsFiles = this._getAllJsFiles(filePath, reg)
    
    //使用自定义规则扫描所有JS文件，并生成报告
    var outputDir = this.params.outputPath + '/reports' || process.cwd() + '/reports'

    this.stdouts.inputPath = filePath
    this.stdouts.outputPath = outputDir

    var useRules = hyfeRules

    //使用ES6/7语法并执行JSX
    if(this.params.es6more && this.params.isJsx) {
      useRules.parserOptions = {
        ecmaVersion: 7,
        sourceType: 'module',
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          jsx: true
        }
      }
    } else if(this.params.isJsx) {
      useRules.parserOptions = {
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          jsx: true
        }
      }
    }

    if(this.params.isReact) {
      useRules.plugins = ['react']
      useRules.extends = ['eslint:recommended', 'plugin:react/recommended']
    }

    var options = {
      title: this.params.reportTitle,
      eslint: useRules
    }

    // var jsFileNums = allJsFiles.length
    // var num = 0
    // var reports = []
    // var len = Math.ceil(allJsFiles.length / SPLIT_COUNT)

    var callback = function() {
      // var util = require('util')

      // self.log(util.inspect(process.memoryUsage()))
            
      self.log((self.params.reportTitle + 'JavaScript代码扫描完成......').green.bold)
      self.log(' ')
      self.log(('===================' + self.params.reportTitle + '基本信息===================').green.bold)
      self.log(' ')
      self.log(('扫描的项目路径：' + self.stdouts.inputPath).cyan.bold)
      self.log(('扫描报告主题：' + self.params.reportTitle).cyan.bold)
      self.log(('结果报告目录路径：' + self.stdouts.outputPath).cyan.bold)
      self.log(' ')
      self.log(('查看扫描结果').gray)
      self.log(('    查看项目中各文件汇总信息：' + self.stdouts.outputPath + '/display.html').gray)
      self.log(('    查看项目文件具体信息：' + self.stdouts.outputPath + '/index.html').gray)

      // num++
      // if(num < len) {
      //     process.nextTick(function() {
      //         plato.inspect(reports[num], outputDir + num, options, callback)
      //     }, 10000)
      // }
    }

    plato.inspect(allJsFiles, outputDir, options, callback)
        //每25个文件一份报告
    // if(jsFileNums > SPLIT_COUNT) {
    //   for(var i = 0; i < len; i++) {
    //     reports.push(allJsFiles.splice(0, SPLIT_COUNT))
    //   }
            
    //   plato.inspect(reports[num], outputDir + num, options, callback)
    // } else {
    //   plato.inspect(allJsFiles, outputDir, options, callback)
    // }
  },
  _getAllJsFiles: function(filePath, reg) {
    var self = this
    var result = []
    var files = fs.readdirSync(filePath)

    files.forEach(function(file){
      var pathname = filePath + '/' + file
      var stat = fs.lstatSync(pathname)
      
      //过滤要排除的文件或文件夹
      if(!reg.test(file)) {
        if (stat.isDirectory()){
          result = result.concat(self._getAllJsFiles(pathname, reg))
        } else {
          var extname = path.extname(file)
          if(extname === '.js') {
            result.push(pathname)
          }
        }
      }
    })
    return result
  }
})
