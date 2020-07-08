
export class DataType {
  /**
   * 判断是否为某一数据类型
   * @param data 需要判断类型的值
   * @param type 类型
   */
  public static is(data: any, type: string): boolean {
    return DataType.getType(data) === type;
  }
  /**
   * 获取数据类型
   * @param data 需要判断类型的值
   */
  public static getType(data: any) {
    return Object.prototype.toString.call(data).replace(/\[object (\w+)\]/, "$1").toLowerCase();
  }
}