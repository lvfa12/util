const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ip = require("ip")
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.ts",
  output: {
    path: path.resolve('./', "dist"),
    filename: "./js/[name]-[hash:16]-bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@util": path.resolve('./utils'),
      "@": path.resolve('./src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['babel-loader', "ts-loader"]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false, // 模拟删除
      verbose: true, // 删除文件时将日志输出在控制台
    }),
    new HtmlWebpackPlugin({
      title: "测试页面",
      filename: 'index.html',
      template: "./index.html",
      inject: "body",
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }
      })
    ]
  },
  devServer: {
    contentBase: path.join(path.resolve('./'), "dist"),
    compress: false,
    port: 8083,
    host: ip.address(),
    index: 'index.html',
    open: true,
  }
};