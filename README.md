Delta webpack plugin
=========

Webpack plugin for improved dependency management. Used by DeltaJS and another component libraries.

## Installation

```bash
  npm i --save-dev delta-webpack-plugin
```
## Usage

The plugin adds dependencies to a module that uses dynamic import. Just add the plugin to your `webpack`
config as follows:


**loader.js**
```js
const loadedModule = (
    await import(/* webpackMode: "eager" */url )
    .catch(err=>{throw err;}
));
console.log(loadedModule);
```
**webpack.config.js**
```js
const DeltaWebpackPlugin = require('delta-webpack-plugin')

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new DeltaWebpackPlugin({
        test: /loader\.js$/,
        dependencies:  [path.join(__dirname, "./src/my-module.js")]
    })
  ]
}
```
**Result**

```
Module ./src/my-module.js added to loader.js as dependency
```

## Tests

  `npm test`



## Options

You can pass a hash of configuration options to delta-webpack-plugin. Allowed values are as follows:

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`test`](#)**|`{Regexp | String | Function}`|`undefined`|Specifies the module to which you want to add dependencies. If this option is omitted the dependencies will be add to all modules with dynamic import |
|**[`dependencies`](#)**|`{Array.<string>}`|`{}`|Should contain absolute paths of the dependencies|
|**[`templates`](#)**|`{Array.<string>}`|`{}`|An array of absolute template paths containing references to dependencies|
|**[`templateOptions`](#)**|`{Object}`|`{}`|Parameters for extracting references from templates|
|**[`templateOptions.replacementTest`](#)**|`{Regexp}`|`/<!--(.|\s)*?-->/gm`|Specifies the blocks that should be excluded from the analysis|
|**[`templateOptions.attrs`](#)**|`{Array.<string>}`|`['data-app', 'data-control']`|Specifies the attributes that contain dependency references|

Here's an example webpack config illustrating how to use these options

### `Setup dependencies from templates`

To setup dependencies from templates, specify `options.template` field

**src/my-template.html**
```html
<div data-my-component="app/my-application">
    <div data-my-component="app/my-component"></div>
</div>
```

**src/index.js**
```js
const loadedModule = (
    await import(/* webpackMode: "eager" */url )
    .catch(err=>{throw err;}
));
console.log(loadedModule);
```

**webpack.config.js**
```js
const DeltaWebpackPlugin = require('delta-webpack-plugin');
module.exports = {
  entry: [path.join(__dirname, "src/index.js")],
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new DeltaWebpackPlugin({
        test: /src\/index\.js$/,
        templates:  [path.join(__dirname, "src/my-template.html")],
        templateOptions: {
            attrs: ["data-my-component"]
        }
    })
  ]
}
```



