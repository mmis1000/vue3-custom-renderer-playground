const vuePluginNext = require.resolve('vue-cli-plugin-vue-next')
const vueLoaderNext = require.resolve('vue-loader', {paths: [vuePluginNext] })

const path = require.resolve('./src/runtime-canvas/compiler')
const LoaderPatchPlugin = require('./loaderPatch/plugin')

module.exports = {
    parallel: true,
    publicPath: './',
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader(vueLoaderNext)
            .tap(options => {
                // modify the options...
                return {
                    ...options,
                    compiler: path
                }
            })

        config.plugin('loader-patched')
            .use(new LoaderPatchPlugin())
    },
    devServer: {
        disableHostCheck: true,
    }
}