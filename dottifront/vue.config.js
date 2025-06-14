const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: false
})

module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  }
}