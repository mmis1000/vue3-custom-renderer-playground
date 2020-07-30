const vueNextPluginPath = require.resolve('vue-cli-plugin-vue-next')
const vueTemplateLoaderPath = require.resolve('vue-loader/dist/templateLoader.js',  { paths: [vueNextPluginPath] })
const vueTemplateLoader = require(vueTemplateLoaderPath)

const loaderUtilPath = require.resolve('loader-utils',  { paths: [vueTemplateLoaderPath] })
const loaderUtils = require(loaderUtilPath)

function TemplateLoaderWrapper (...args) {
    const loaderContext = this;
    const options = (loaderUtils.getOptions(loaderContext) || {});
    if (typeof options.compiler === 'string') {
        loaderContext.loaders[loaderContext.loaderIndex]
            .options = {
                ...options,
                compiler: require(options.compiler)
            }
    }

    return vueTemplateLoader.default.call(this, ...args)
}
module.exports = TemplateLoaderWrapper