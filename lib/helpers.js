const CommonJsRequireDependency = require("webpack/lib/dependencies/CommonJsRequireDependency");
const _path = require("path");

const helpers = module.exports = {
    /**
     * Extracts directory, file name and extension from file path
     *
     * @param path
     * @returns {*[]}
     */
    getFileInfo: function (path){
        const dirName = _path.dirname(path);
        const extName =  _path.extname(path);
        let fileName = _path.basename(path);

        if (extName){
            fileName = fileName.substr(0, fileName.length - extName.length);
        }

        return [dirName, fileName, extName];
    },
    /*/!**
     * Converts absolute path
     * @param source
     * @param target
     * @param addSiblingSeparator
     * @returns {string}
     *!/
    getRelativePath: function(source, target, addSiblingSeparator) {
        let sep = (source.indexOf("/") !== -1) ? "/" : "\\",
            targetArr = target.split(sep),
            sourceArr = source.split(sep),
            filename = targetArr.pop(),
            targetPath = targetArr.join(sep),
            relativePath = "";

        while (targetPath.indexOf(sourceArr.join(sep)) === -1) {
            sourceArr.pop();
            relativePath += ".." + sep;
        }

        const relPathArr = targetArr.slice(sourceArr.length);
        relPathArr.length && (relativePath += relPathArr.join(sep) + sep);
        if (addSiblingSeparator && !relativePath.startsWith(sep) && !relativePath.startsWith(".")){
            relativePath = "." + sep + relativePath;
        }
        return relativePath + filename;
    },*/
    /**
     * Normalizes and appends dependency to specified module
     *
     * @param {Array} aliases Object containing webpack aliases
     * @param {Object} module Webpack module
     * @param {String} dependencyReference Dependency module file path
     */
    addDependency: function(aliases, module, dependencyReference){

        const value = aliases ?
            //(helpers.getNormalizedName(aliases, dep) || helpers.getRelativePath(module.context, dep)) :
            (helpers.getNormalizedName(aliases, dependencyReference) || _path.relative(module.context, dependencyReference)) :
            dependencyReference;

        module.dependencies.push(new CommonJsRequireDependency(value, null))
    },
    /**
     * Normalizes file path replacing part of path by alias
     *
     * @param aliases
     * @param filePath
     * @returns {*}
     */
    getNormalizedName: function(aliases, filePath){
        let key;
        /*for(key in aliases){
            if (context.startsWith(key)){
                return context;
            }
        }*/
        for(key in aliases){

            let aliasPath = aliases[key].replace(/\/$/, "") + "/";
            if (filePath.startsWith(aliasPath)){
                return key + "/" + filePath.substr(aliasPath.length);
            }
        }
        return undefined;
    }

};




