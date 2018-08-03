/**
* @Author: fiyc
* @Date : 2018-07-26 15:57
* @FileName : sdk-module.js
* @Description : 
    - 对openlink-core sdk的封装模块
*/



var sdk = require('openlink-sdk');
let fs = require("fs");
let appInfo = require('../app.json');

let sdkConfig = {
    thrift: {
        port: appInfo.appThriftPort,
        cmd_handlers: [],
        trigger_handlers: []
    },
    appinfo: appInfo
    // baseUrl: 'http://172.28.10.26:8081/'
};

let sdkInstance = sdk(sdkConfig);

module.exports = {
    apis: sdkInstance.apis,
    dynamic_register: sdkInstance.dynamic_register,
    router: sdkInstance.Router
};