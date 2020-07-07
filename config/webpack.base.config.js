const path = require('path');


module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  target: "web",
  output: {
    path: path.resolve('./', "dist"),
    filename: "./index.js",
    library: 'library', // 
    libraryTarget: 'umd', // 使其可用Script引入，AMD,commonjs, ES6 module
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
  // plugins: [
  //   new CleanWebpackPlugin({
  //     dry: false, // 模拟删除
  //     verbose: true, // 删除文件时将日志输出在控制台
  //   }),
  // ],
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       uglifyOptions: {
  //         output: {
  //           comments: false
  //         },
  //         compress: {
  //           drop_debugger: true,
  //           drop_console: true
  //         }
  //       }
  //     })
  //   ]
  // },

};

