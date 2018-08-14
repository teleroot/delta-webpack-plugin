const _fs = require("fs");

function normalizeRegexp(re, options){
    let pattern = re.source;
    if (options.attrs && options.attrs.length){
        pattern = pattern.replace(':DATA_CONTROL_ATTR:', "("+options.attrs.join("|")+")");
    }
    return new RegExp(pattern, re.flags);
}
const defaultExtractOptions = {
    replacementTest: /<!--(.|\s)*?-->/gm,
    attrs: ["data-app", "data-control"]
};
function extractControls(text, options) {
    if (!text){
        return {};
    }
    if (options.replacementTest){
        text = text.replace(options.replacementTest, "");
        if (!text){
            return {};
        }
    }
    let res = [];
    //let re = normalizeRegexp(/<[^>]+\s(:DATA_APP_ATTR:=(\'|\")([^\"|^\']+)?(\'|\"))|<[^>]+\s(:DATA_CONTROL_ATTR:=(\'|\")([^\"|^\']+)?(\'|\"))/igm,
    let re = normalizeRegexp(/<[^>]+\s(:DATA_CONTROL_ATTR:=(\'|\")([^\"|^\']+)?(\'|\"))/igm,
        options),
        match;
        endBrace = /(\'|\")$/ig;
    while (match = re.exec(text)) {
        //const m = match[0].replace(start, "").replace(endBrace, "");
        const m = match[4];
        res.push(m);
    }
    return res;
}

function extractControlsFromFile(filePath, options){
    const file = _fs.readFileSync(filePath, "utf8");
    return extractControls(file, options);
}

/**
 * Extracts control references from multiple files
 *
 * @param baseFolder
 * @param inputFiles
 * @param options
 * @returns {Array}
 */
function extractControlsFromFileList(baseFolder, inputFiles, options){
    options = Object.assign({}, defaultExtractOptions, options);
    let res = [];
    inputFiles.forEach(function(v){
        const p = baseFolder ? path.join(baseFolder, v) : v;
        res.push.apply(res, extractControlsFromFile(p, options));
    });
    return res;
}

/**
 *
 * @type {{extractControlsFromFileList: extractControlsFromFileList}}
 */
module.exports = {
    extractControlsFromFileList: extractControlsFromFileList
};