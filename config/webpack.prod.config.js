const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path')
// const TypescriptDeclarationGenerator = require('tsd-webpack-plugin');
// const TypingsBundlerPlugin = require('typings-bundler-plugin');
module.exports = webpackMerge.smart(baseConfig, {
  plugins: [
    new CleanWebpackPlugin({
      dry: false, // 模拟删除
      verbose: true, // 删除文件时将日志输出在控制台
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve("./types/index.d.ts"),
        to: path.resolve("./dist/index.d.ts")
      }]
    }),
    // new TypingsBundlerPlugin({
    //   out: './index.d.ts'
    // })
    // new TypescriptDeclarationGenerator({
    //   moduleName: 'lib',
    //   out: './index.d.ts', // The reference here is your output file folder.
    // })
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
});