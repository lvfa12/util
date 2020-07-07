/**
 * 触发方法
 * @augments args 触发时携带的参数
 */
interface triggerFn {
  (...args: any[]): void
}

/**
 * 防抖
 * @param  callback 防抖的回调函数
 * @param  scope    回调函数的作用域, 默认值为null
 * @param  delay    防抖的时间默认500，单位ms
 */
export declare function debounce(callback: Function, scope?: any, delay?: number): triggerFn;

/**
 * 节流
 * @param callback    回调函数，未触发过则立即触发，已触发过则在间隔时间后触发
 * @param scope       回调的作用域
 * @param delay       触发间隔.
 */
export declare function throttle(callback: Function, scope?: unknown, delay?: number): triggerFn;

/**
 * 使之后的代码延时执行
 * @param time 延时时间,默认500,单位ms
 * @return Promise
 */
export declare function delay(time?: number): Promise<any>;

