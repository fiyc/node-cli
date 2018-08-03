let fs = require('fs');
let path = require('path');
let h = require('handlebars');

/**
 * 拷贝文件 
 * @param {*} src 源文件路径
 * @param {*} target 目标文件路径
 */
let copyFile = function (src, target) {
    fs.writeFileSync(target, fs.readFileSync(src));
}

/**
 *  拷贝目录
 * @param {*} src 源文件路径
 * @param {*} target 目标文件路径
 */
let copyFloder = function (src, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }

    let files = fs.readdirSync(src);
    files.forEach(item => {
        let srcPath = path.join(src, item);
        let targetPath = path.join(target, item);
        let stats = fs.statSync(srcPath);

        if (stats.isDirectory()) {
            copyFloder(srcPath, targetPath);
        } else {
            copyFile(srcPath, targetPath);
        }
    });
}


/**
 * 使用模板生成文件并保存
 * @param {*} savePath 
 * @param {*} config 
 * @param {*} templateName 
 */
let compareTemplateAndSave = function (savePath, config, templateName) {
    let targetTemplatePath = path.join(__dirname, `templates/${templateName}`);
    let templateContent = fs.readFileSync(targetTemplatePath, 'utf-8').toString();
    let result = h.compile(templateContent)(config);
    fs.writeFileSync(savePath, result);
}

/**
 * 拷贝初始项目结构到目标地址
 * @param {*} savePath 
 */
let initProject = function(savePath){
    let src = path.join(__dirname, "templates/project-template");
    copyFloder(src, savePath);
}

module.exports = {
    compareTemplateAndSave,
    initProject
};