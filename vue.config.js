const vuePluginNext = require.resolve('vue-cli-plugin-vue-next')
const vueLoaderNext = require.resolve('vue-loader', {paths: [vuePluginNext] })

module.exports = {
    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader(vueLoaderNext)
            .tap(options => {
                // modify the options...
                return {
                    ...options,
                    compiler: require('./src/runtime-canvas/compiler')
                }
            })
    },
    devServer: {
        disableHostCheck: true,
    }
}