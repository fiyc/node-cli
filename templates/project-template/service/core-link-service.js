/**
* @Author: fiyc
* @Date : 2018-08-01 17:16
* @FileName : core-link-service.js
* @Description : 
    - 绑定openlink - core 逻辑service
    - 该模块虽然在service层, 但实际上依赖于其他service, 因此实际位于controller与service之间
*/



let log = require('../common/Log');
let constants = require('../common/constants');
let r = require('../common/r');
let sf = require('../common/safe-function');

let sdk = require('../modules/sdk-module');





let service = {
    /**
     * 对所有的变量配置进行绑定
     */
    bind: async function () {
    },

    /**
     * 生成绑定回调函数
     * @param triggerKey 触发器
     */
    makeHander: function () {
    },

    /**
     * 执行任务
     * @param taskId 任务id
     */
    executeTask: function () {
    }
};



service = sf.convertSafeFn(service);
module.exports = service;