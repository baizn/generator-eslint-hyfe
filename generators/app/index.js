var generator = require('yeoman-generator')
var path = require('path')
var fs = require('fs')
var colors = require('colors')
var prompts = require('./prompts')
var plato = require('plato-zh')
var hyfeRules = require('eslint-config-hyfe')

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
            return this.prompt(prompts).then(function (answers) {
                
                if(!answers.action) {
                    console.log('\033[31m 终止扫描' + answers.inputPath + '项目\033[39m\n')
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

    writing: {
        checkingFiles: function() {
            var self = this
            //读取输入目录下的所有js文件
            var filePath = this.params.inputPath || process.cwd()

            var allJsFiles = this._getAllJsFiles(filePath)

            //使用自定义规则扫描所有JS文件，并生成报告
            var outputDir = this.params.outputPath + '/output' || process.cwd() + '/output'

            this.stdouts.inputPath = filePath
            this.stdouts.outputPath = outputDir

            var options = {
                title: this.params.reportTitle,
                eslint: hyfeRules
            }

            var callback = function(report) {
                console.log((self.params.reportTitle + 'JavaScript代码扫描完成......').green.bold)
                console.log(' ')
                console.log(('===================' + self.params.reportTitle + '基本信息===================').green.bold)
                console.log(' ')
                console.log(('扫描的项目路径：' + self.stdouts.inputPath).cyan.bold)
                console.log(('扫描报告主题：' + self.params.reportTitle).cyan.bold)
                console.log(('结果报告目录路径：' + self.stdouts.outputPath).cyan.bold)
                console.log(' ')
                console.log(('查看扫描结果').gray)
                console.log(('    查看项目中各文件汇总信息：' + self.stdouts.outputPath + '/display.html').gray)
                console.log(('    查看项目文件具体信息：' + self.stdouts.outputPath + '/index.html').gray);
            }

            plato.inspect(allJsFiles, outputDir, options, callback)
            
        }
        
    },
    // end: function () {
    //     this.log(('===================' + this.params.reportTitle + '基本信息===================').cyan.bold)
    //     this.log(('扫描的项目路径："' + this.stdouts.inputPath).green.bold)
    //     this.log(('扫描报告主题：' + this.params.reportTitle).green.bold)
    //     this.log(('结果报告目录路径：' + this.stdouts.outputPath).green.bold)
    //     this.log(('查看扫描结果').gray)
    //     this.log(('    查看项目中各文件汇总信息：' + this.stdouts.outputPath + '/display.html').gray)
    //     this.log(('    查看项目文件具体信息：' + this.stdouts.outputPath + '/index.html').gray);
    // },
    _getAllJsFiles: function(filePath) {
        var result = [];
        var files = fs.readdirSync(filePath)
        files.forEach(function(file){
            var pathname = filePath + '/' + file
            var stat = fs.lstatSync(pathname)

            if (stat.isDirectory()){
                var arr = ['node_modules', 'test']
                if(arr.indexOf(file) == -1) {
                    result = result.concat(getAllFiles(pathname));
                }

            } else {
                var extname = path.extname(file)
                if(extname === '.js') {
                    result.push(pathname);
                }
            }
        })
        return result
    },
})