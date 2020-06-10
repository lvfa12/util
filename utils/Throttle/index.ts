/**
 * 节流
 * @param callback    回调函数，未触发过则立即触发，已触发过则在间隔时间后触发
 * @param scope       回调的作用域
 * @param delay       触发间隔
 */
export function throttle(callback: Function, scope: unknown = null, delay: number = 500) {
  let preDate = 0; // 上一次触发的时间
  let timer: number | NodeJS.Timeout = null;
  /**
   * @param 任意数量的参数
   */
  return function (...args: any[]): void {
    let nowDate = Date.now();
    if (nowDate - delay < preDate) {
      timer && clearTimeout(timer as number);
      timer = setTimeout(() => {
        callback.apply(scope, args);
        preDate = nowDate;
      }, delay);
    } else {
      callback.apply(scope, args);
      preDate = nowDate;
    }
  }
}