/*
 * bom
 * http://www.b5m.com/
 */

'use strict';

var fis = module.exports = require('fis');

fis.cli.name = 'bom';
//package.json
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');
//merge standard conf
fis.config.merge({
  roadmap: {
    path: [{
      //map.json不做发布了，项目不需要
      reg: 'map.json',
      //发布到/config/map.json
      release: false
    }, {
      //.mixin.less后缀的文件
      reg: '**/common.mixin.less',
      //仅当做函数调用，不发布
      release: false
    }, {
      //grid.less，不发布
      reg: '**/grid.less',
      release: false
    }, {
      //normalize.less,不发布
      reg: '**/normalize.less',
      release: false
    }, {
      //var.less后缀的文件
      reg: '**/common.var.less',
      //仅当做函数调用，不发布
      release: false
    }],
    ext: {
      //less输出为css文件
      less: 'css'
    }
  },
  modules: { //fis插件配置
    parser: {
      //.less后缀的文件使用fis-parser-less插件编译
      less: 'less'
    },
    // fis打包后处理插件，解决项目打包保持除min文件之外不做压缩处理。
    postpackager: 'min'
  },
  settings: {
    postprocessor: {
      jswrapper: {
        //用fis的js包装器，更方便书写
        type: 'amd'
      }
    },
    optimizer: {
      'uglify-js': {
        mangle: {
          //不要压缩require关键字
          except: ['om']
        }
      }
    }
  }
});
