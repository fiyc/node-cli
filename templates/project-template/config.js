/**
* @Author: fiyc
* @Date : 2018-07-24 14:50
* @FileName : config.js
* @Description : 
    - 项目配置文件
    - 由于json文件不好加注释, 所以使用单独一个模块来作为配置
*/


var path = require('path');

var globalConfig = {
    /**
     * sqlite数据库名
     */
    dbName: 'default.db',

    /**
     * 数据库文件路径
     */
    dbFilePath: path.join(__dirname, 'default.db')
};

module.exports = globalConfig;