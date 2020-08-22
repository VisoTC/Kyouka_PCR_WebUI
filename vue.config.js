module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    public: '127.0.0.1:8080'  // 本地ip
  },
  productionSourceMap: false,
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title= 'PCR Plugin WebUI'
        return args
      })
  }
}