
// /** 先引入所有，没有用到或者未使用的不会被导出 */
// import { BinaryTree } from '@util/BinaryTree/index';  // 二叉树
import { debounce } from '@util/Debounce/index';         // 防抖
import { throttle } from '@util/Throttle/index';         // 节流
import { delay } from "@util/delay/index";               // 延时执行
import { Ws } from '@util/Ws/index';                     // websocket
import { Publish, Subscribe } from "@util/PubSub/index"; // 发布订阅
import { CountDown } from "@util/CountDown/index";       // 倒计时
import { formatData } from "@util/formatData/index";     // 格式化获取到的数据
import { DataType } from '@util/DataType/index';
// /** 下面填写需要打包导出的东西 */
export {
  debounce,
  throttle,
  // BinaryTree,
  delay,
  Publish,
  Subscribe,
  Ws,
  CountDown,
  formatData,
  DataType,
};


/*********************** 测试用代码 ******************/
// import * as lib from '@/../dist/index';
// lib.formatData
// let a = new Ws();
// console.log(a);
// console.log(DataType.getType(NaN))

import "./test/formatData/index";