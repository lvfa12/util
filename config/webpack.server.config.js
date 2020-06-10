const path = require('path');
// var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const webpack = require('webpack');
// const ip = require("ip")
module.exports = {
  mode: "development",
  target: 'node',
  devtool: "inline-source-map",
  entry: "./src/serverIndex.ts",
  output: {
    path: path.resolve('./', "serverDist"),
    filename: "./bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@util": path.resolve('./utils'),
      "@":path.resolve('./src'),
    }
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false, // 模拟删除
      verbose: true, // 删除文件时将日志输出在控制台
      // cleanOnceBeforeBuildPatterns: ['./js/**/*',"!**/*.html"]
    }),
  ],
};