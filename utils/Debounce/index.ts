/**
 * 防抖
 * @param  callback 防抖的回调函数
 * @param  scope    回调函数的作用域
 * @param  delay    防抖的时间默认500，单位ms
 */
export function debounce(callback: Function, scope: any = null, delay: number = 500) {
  let time: number | NodeJS.Timeout = null;
  /**
   * @param 任意个数的参数
   */
  return function (...args: any[]) {
    time && clearTimeout(time as number);
    time = setTimeout(callback.bind(scope), delay, ...args);
  }
}

