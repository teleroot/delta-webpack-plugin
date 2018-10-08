const ContextModule = require("webpack/lib/ContextModule");
const helpers = require("./lib/helpers");
const extractControlsFromFileList = require("./lib/extract-controls").extractControlsFromFileList;

const defaultOptions = {
    test: undefined,
    dependencies: []
};


class DeltaWebpackPlugin {

    constructor(options) {
        this.options = Object.assign({}, defaultOptions, options || {});
        let target = this.options.test;
        let defFunction = function(module){
            return module instanceof ContextModule;
        };
        if (target===undefined || target === null){
            this.targetFunc = defFunction;
        } else if (target instanceof RegExp){
            this.targetFunc = function(module){
                return module instanceof ContextModule &&
                    module.issuer && module.issuer.request && target.test(module.issuer.request.replace(/\\/g, "/"));
            }
        } else if (typeof target === "function") {
            this.targetFunc = target.bind(this);
        }
        else {
            this.targetFunc = function(module){
                return module.request === target;
            }
        }
        let createPair = function(v){
            v = helpers.getFileInfo(v);
            return [v[0] + "/" + v[1] + (v[2] || ".js"), v[0] + "/" + v[1]]
        };
        if (this.options.templates){
            let templateDependencies = extractControlsFromFileList(undefined, this.options.templates, this.options.templateOptions);
            this.templateDependencies = templateDependencies.map(createPair);
        } else {
            this.templateDependencies = [];
        }
        this.options.dependencies = this.options.dependencies.map(createPair);
    }
    apply(compiler) {
        const aliases = compiler.options.resolve.alias;
        const hasDeps = (this.options.dependencies && this.options.dependencies.length) ||
            (this.templateDependencies && this.templateDependencies.length);
        if (!hasDeps){
            return;
        }
        compiler.plugin("compilation", compilation => {
            compilation.plugin("succeed-module", module => {
                if (this.targetFunc(module)){
                    this.templateDependencies.forEach(dep =>{
                        helpers.addDependency(null, module, dep[0]);
                        helpers.addDependency(null, module, dep[1]);
                    });
                    this.options.dependencies.forEach(dep =>{
                        helpers.addDependency(aliases, module, dep[0]);
                        helpers.addDependency(aliases, module, dep[1]);
                    })
                }

            })
        })
    }
}

module.exports = DeltaWebpackPlugin;
