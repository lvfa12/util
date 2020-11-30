// 数组中的原型方法
type ARRAYPROTOFUN = keyof Omit<Array<any>, "length">;
interface options {
  before?: Function,
  after?: Function
}
/**
 * 生成劫持数组方法的__proto__
 * @param hackMethodNames 劫持的方法名
 */
export const generateArray__proto__ = function (hackMethodNames: Array<ARRAYPROTOFUN>, options: options) {
  const arrayProto: [any] = Object.create(Array.prototype);
  hackMethodNames.forEach(key => arrayProto[key] = function () {
    options.before && options.before();
    Array.prototype[key].call(this, ...arguments);
    options.after && options.after();
  });
  return arrayProto;
}
