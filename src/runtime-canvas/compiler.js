const { baseCompile, baseParse } = require('@vue/compiler-core')
Object.assign(module.exports, require('@vue/compiler-core'))

module.exports.compile = baseCompile
module.exports.parse = baseParse