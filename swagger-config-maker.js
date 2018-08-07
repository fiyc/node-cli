/**
* @Author: fiyc
* @Date : 2018-08-07 13:47
* @FileName : swagger-config-maker.js
* @Description : 
    - swagger ui 配置json生成模块
*/

let baseConfig = {
    swagger: "2.0",
    info: {
        description: "no description",
        version: "1.0.0",
        title: "API"
    },
    host: "127.0.0.1:8080",
    basePath: "",
    tags: [],
    paths: {}
};

const integerType = ["NUMBER", "TINYINT", "SMALLINT", "MEDIUMINT", "INTEGER", "BIGINT", "FLOAT"];
const booleanType = ["BOOLEAN"]



/**
 * 初始化配置基本信息
 * @param {*} description 
 * @param {*} title 
 * @param {*} host 
 * @param {*} basePath 
 */
let init = function (description, title, host, basePath) {

    if (description) {
        baseConfig.info.description = description;
    }

    if (title) {
        baseConfig.info.title = title;
    }

    if (host) {
        baseConfig.host = host;
    }

    if (basePath) {
        baseConfig.basePath = basePath;
    }
}

/**
 * 添加tag
 * @param {*} tag 
 * @param {*} desc 
 */
let addTag = function (tag, desc) {
    baseConfig.tags.push({
        name: tag,
        description: desc
    });
}

/**
 * 添加一个接口
 * @param {*} path 
 * @param {*} method 
 * @param {*} tag 
 * @param {*} summary 
 */
let addApi = function (path, method, tag, summary) {
    let defaultApi = {
        tags: [],
        summary: "",
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [],
        responses: {
            "200": {
                description: "successful operation",
            },
            "400": {
                description: "Invalid status value"
            }
        }
    };

    if (!baseConfig.paths[path]) {
        baseConfig.paths[path] = {};
    }

    baseConfig.paths[path][method] = defaultApi;

    if (tag) {
        defaultApi.tags.push(tag);
    }

    if (summary) {
        defaultApi.summary = summary;
    }
}



let addParameter = function (path, method, param) {
    baseConfig.paths[path][method].parameters.push(param);
}

let addResponse = function (path, method, response) {
    baseConfig.paths[path][method].responses["200"] = response
}

let output = function (config) {
    let description = ``;
    let title = `${config.name} 接口`;
    let port = config.port;
    init(description, title, `127.0.0.1:${port}`, '/api');

    if (config.tables) {
        config.tables.forEach(t => {
            addTag(t.tableAlias, t.comment);
            findAllMaker(t);
            findDetailMaker(t);
            insertMaker(t);
            updateMaker(t);
            deleteMaker(t);
        });
    }

    return JSON.stringify(baseConfig);

}

let getCommonResponse = function () {
    let response = {
        description: "successful operation",
        schema: {
            type: "object",
            properties: {
                success: {
                    type: "boolean"
                },

                message: {
                    type: "string"
                },

                data: {

                }
            }
        }
    };

    return response;
}

let getSingleResponse = function (type) {
    let response = getCommonResponse();
    let data = response.schema.properties.data;
    data.type = type;
    return response;
}

let getListResponse = function (items) {
    let response = getCommonResponse();
    let data = response.schema.properties.data;
    data.type = "object";
    data.properties = {
        total: {
            type: "integer"
        },
        list: {
            type: "array",
            items: {
                properties: items
            }
        }
    };

    return response;
}

let getDetailResponse = function (items) {
    let response = getCommonResponse();
    let data = response.schema.properties.data;
    data.type = "object";
    data.properties = items;
    return response;
}

let getPostParam = function(items){
    let common = {
        name: "postBody",
        in: "body",
        description: "post数据",
        schema: {
            properties: items
        }
    };

    return common;
}


let findAllMaker = function (config) {
    addApi(`/${config.tableAlias}/find`, 'get', config.tableAlias, `${config.tableAlias} 查询接口`);

    let parameters = [{
        name: 'pageNumber',
        in: 'query',
        description: '分页查询页码',
        required: false,
        type: 'integer'
    }, {
        name: 'pageSize',
        in: 'query',
        description: '分页查询每页数量',
        required: false,
        type: 'integer'
    }];


    parameters.forEach(p => {
        addParameter(`/${config.tableAlias}/find`, 'get', p);
    });

    let items = {};
    config.columns.forEach(c => {
        let type = '';
        if (integerType.includes(c.columnType)) {
            type = "integer";
        } else if (booleanType.includes(c.columnType)) {
            type = "boolean"
        } else {
            type = "string"
        }

        items[c.columnName] = {
            type: type
        }
    });

    let response = getListResponse(items);
    addResponse(`/${config.tableAlias}/find`, 'get', response);
}

let findDetailMaker = function (config) {
    addApi(`/${config.tableAlias}/detail`, 'get', config.tableAlias, `${config.tableAlias} 查询详情`);
    addParameter(`/${config.tableAlias}/detail`, 'get', {
        name: 'id',
        in: 'query',
        description: '主键id',
        required: true,
        type: 'integer'
    });

    let items = {};
    config.columns.forEach(c => {
        let type = '';
        if (integerType.includes(c.columnType)) {
            type = "integer";
        } else if (booleanType.includes(c.columnType)) {
            type = "boolean"
        } else {
            type = "string"
        }

        items[c.columnName] = {
            type: type
        }
    });

    let response = getDetailResponse(items);
    addResponse(`/${config.tableAlias}/detail`, 'get',  response);
}

let insertMaker = function (config) {
    addApi(`/${config.tableAlias}/insert`, 'post', config.tableAlias, `${config.tableAlias} 新增`);

    let items = {};
    config.columns.forEach(c => {
        if (c.columnName === "id") {
            return;
        }

        let type = '';
        if (integerType.includes(c.columnType)) {
            type = "integer";
        } else if (booleanType.includes(c.columnType)) {
            type = "boolean"
        } else {
            type = "string"
        }

        items[c.columnName] = {
            type: type
        };

    });

    let request = getPostParam(items);
    addParameter(`/${config.tableAlias}/insert`, 'post', request);

    let response = getSingleResponse('integer');
    addResponse(`/${config.tableAlias}/insert`, 'post', response);
}

let updateMaker = function (config) {
    addApi(`/${config.tableAlias}/update`, 'put', config.tableAlias, `${config.tableAlias} 修改`);

    let items = {};
    config.columns.forEach(c => {
        let type = '';
        if (integerType.includes(c.columnType)) {
            type = "integer";
        } else if (booleanType.includes(c.columnType)) {
            type = "boolean"
        } else {
            type = "string"
        }

        items[c.columnName] = {
            type: type
        };

    });

    let request = getPostParam(items);
    addParameter(`/${config.tableAlias}/update`, 'put', request);

    let response = getSingleResponse('integer');
    addResponse(`/${config.tableAlias}/update`, 'put',  response);
}

let deleteMaker = function (config) {
    addApi(`/${config.tableAlias}/delete`, 'delete', config.tableAlias, `${config.tableAlias} 删除`);
    let request = getPostParam({
        id: {
            type: "integer"
        }
    });
    addParameter(`/${config.tableAlias}/delete`, 'delete', request);

    let response = getSingleResponse('integer');
    addResponse(`/${config.tableAlias}/delete`, 'delete',  response);
}

module.exports = output;