/**
* @Author: fiyc
* @Date : 2018-07-26 13:48
* @FileName : global-controller.js
* @Description :   
    - 完成一些从openlink-core中获取数据的接口
*/

let base = require('./base');
let r = base.r;
let errorHandle = base.errorCallback;
let sf = require('../common/safe-function');
let log = require('../common/Log');

let sdk = require('../modules/sdk-module');

let openlinkApi = {

    /**
     * openlink登录接口
     * @param userName 用户名
     * @param password 密码
     */
    login: function(req, res, next){

    },

    /**
     * 对请求进行token验证 
     * @param header.token
     */
    tokenCheck: function(req, res, next){

    },
    /**
     * 获取openlink-core中变量集合
     */
    variables: function(req, res, next){
        sdk.apis.allVariablesUsingGet(function(err, response){
            if(err){
                r(req, res).error(err);
            }else if(response && response.success){
                r(req, res).success('success', response.data);
            }else{
                r(req, res).success(`openlink接口响应出错`);
            }
        });
        return;
    },

    /**
     * 获取openlink-core中触发器集合
     */
    triggers: function(req, res, next){
        sdk.apis.getTriggersUsingGet(1, 5000, false, function(err, response){
            if(err){
                r(req, res).error(err);
            }else if(response && response.success){
                r(req, res).success('success', response.data);
            }else{
                r(req, res).success(`openlink接口响应出错`);
            }
        });
        return;
    }
};




//为接口进行装饰
openlinkApi = sf.convertSafeFn(openlinkApi, errorHandle);
module.exports = openlinkApi;