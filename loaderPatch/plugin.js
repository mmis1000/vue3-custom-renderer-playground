const vueNextPluginPath = require.resolve('vue-cli-plugin-vue-next')
const vueTemplateLoaderPath = require.resolve('vue-loader/dist/templateLoader.js', { paths: [vueNextPluginPath] })
class MyPlugin {
    apply(compiler) {
        for (const rule of compiler.options.module.rules) {
            if (rule.loader === vueTemplateLoaderPath) {
                rule.loader = require.resolve('./templateLoaderWrapper')
            }
        }
    }
}

module.exports = MyPlugin