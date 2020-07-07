const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { address } = require("ip");
const { getPortPromise } = require('portfinder');

module.exports = (async () => {
  const port = await getPortPromise({ port: 8080, stopPort: 65535 }); // 获取可用端口
  return webpackMerge.smart(baseConfig, { // 合并配置
    devtool: "inline-source-map",
    plugins: [
      new HtmlWebpackPlugin({
        title: "测试页面",
        filename: 'index.html',
        template: "./index.html",
        inject: "body",
      }),
    ],
    devServer: {
      contentBase: path.join(path.resolve('./'), "dist"),
      compress: false,
      port,
      host: address(),
      index: 'index.html',
      open: true,
      useLocalIp: true
    }
  })
})();