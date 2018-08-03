let path = require('path');
let handler = require('./fileHandler');

let targetConfig;
let targetPath;
let templatePath = path.join(__dirname, '../resources/project-template');
let args = process.argv;
if (args.length < 4) {
    // process.exit(0);
    targetPath = path.join(__dirname, '../../test');
    targetConfig = path.join(__dirname, '../resources/config-template.json');
} else {
    targetPath = path.join(__dirname, args[2]);
    targetConfig = path.join(__dirname, args[3]);
}

targetConfig = require(targetConfig);



//拷贝基本项目结构
handler.initProject(targetPath);

//生成constants
let constantsPath = path.join(targetPath, "common/constants.js");
handler.compareTemplateAndSave(constantsPath, targetConfig, "constants-template.txt");

//生成sqlite配置
let sqlitePath = path.join(targetPath, "modules/sqlite-module.js");
handler.compareTemplateAndSave(sqlitePath, targetConfig, "sqlite-template.txt");

//生成data-service
let dataServicePath = path.join(targetPath, "service/data-service.js");
handler.compareTemplateAndSave(dataServicePath, targetConfig, "data-service-template.txt");

//为每一个table生成service
targetConfig.tables.forEach(item => {
    let itemPath = path.join(targetPath, `service/${item.tableAlias}-service.js`);
    handler.compareTemplateAndSave(itemPath, item, "each-service-template.txt");
});

//为每一个table生成controller
targetConfig.tables.forEach(item => {
    let itemPath = path.join(targetPath, `controller/${item.tableAlias}-controller.js`);
    handler.compareTemplateAndSave(itemPath, item, "each-controller-template.txt");
});

//生成路由文件
let routePath = path.join(targetPath, 'routes/api.js');
handler.compareTemplateAndSave(routePath, targetConfig, "router-template.txt");
