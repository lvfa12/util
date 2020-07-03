type ListType = Map<String, Array<Subscribe>>;
type PubListName = "subscribeList" | "subscribeOnceList";


export class Publish {
  // 存储订阅对象
  private subscribeList: ListType = null;
  // 存储单次订阅的对象
  private subscribeOnceList: ListType = null;
  /**
   * 订阅
   * @param pubName  订阅的名字
   * @param callback 接收订阅信息的接口
   * @param scope    作用域
   */
  public on(pubName: string, callback: Function, scope?: any) {
    if (typeof pubName !== 'string') throw new Error('pubName 必须为string类型的参数');
    if (!(callback instanceof Function)) throw new Error('on 方法的第二个参数必须为function');
    this.pushItem("subscribeList", pubName, new Subscribe(pubName, callback, scope));

    return this;
  }
  /**
   * 单次订阅
   * @param pubName  订阅的名字
   * @param callback 接收订阅信息的接口
   * @param scope    作用域
   */
  public once(pubName: string, callback: Function, scope?: any) {
    if (typeof pubName !== 'string') throw new Error('pubName 必须为string类型的参数');
    if (!(callback instanceof Function)) throw new Error('once 方法的第二个参数必须为function');
    this.pushItem("subscribeOnceList", pubName, new Subscribe(pubName, callback, scope));
    return this;
  }
  /**
   * 取消订阅
   * @description    如果未传callback，那么将所有的pubName全都取消
   * @param pubName  取消订阅的名字
   * @param callback 接收订阅信息的接口
   * @param scope    作用域
   */
  public off(pubName: string, callback?: Function, scope?: any) {
    if (typeof pubName !== 'string') throw new Error('pubName 必须为string类型的参数');
    // 未传回调函数
    if (callback === void 0 || !(callback instanceof Function)) {
      // 未传回调或回调不为方法的，直接清除订阅名为[pubName]的数组
      if (this.subscribeList !== null && this.subscribeList.has(pubName)) this.subscribeList.delete(pubName);
      if (this.subscribeOnceList !== null && this.subscribeOnceList.has(pubName)) this.subscribeOnceList.delete(pubName);
    } else {
      this.removeItem(pubName, callback, scope);
    }
    return this;
  }
  /**
   * 触发通知
   * @param pubName           要通知的订阅名称
   * @param ...callbackValue  剩余通知的数据
   */
  public notify(pubName: string, ...callbackValue: any[]) {
    if (this.subscribeList !== null && this.subscribeList.has(pubName)) {
      this.subscribeList.get(pubName).forEach(item => item.update(...callbackValue));
    }
    if (this.subscribeOnceList !== null && this.subscribeOnceList.has(pubName)) {
      this.subscribeOnceList.get(pubName).forEach(item => item.update(...callbackValue));
      this.subscribeOnceList.set(pubName, []);
    }
    return this;
  }
  /** 取消所有订阅 */
  public clear() {
    if (this.subscribeList !== null) this.subscribeList.clear();
    if (this.subscribeOnceList !== null) this.subscribeOnceList.clear();
    return this;
  }
  /**
   * 向订阅数组添加
   * @param listName 
   * @param name 
   * @param subscribe 
   */
  private pushItem(listName: PubListName, name: string, subscribe: Subscribe) {
    this[listName] = this[listName];
    if (this[listName] === null) this[listName] = new Map();
    // 判断是否有监听的数组,没有就创建一个
    if (!this[listName].has(name)) this[listName].set(name, []);
    // 获取到name对应的数组
    const list = this[listName].get(name);
    // 加入到数组
    list.push(subscribe);
  }
  /**
   * 删除订阅名为[pubName]回调函数为[callback]的订阅
   * @param pubName  订阅名
   * @param callback 接收订阅信息的接口
   * @param scope    作用域
   */
  private removeItem(pubName: string, callback: Function, scope?: any) {
    let tempList: Array<Subscribe> = null;
    if (this.subscribeList !== null && this.subscribeList.has(pubName)) {
      tempList = this.subscribeList.get(pubName);
      tempList = tempList.filter(item => !item.equal(callback, scope));
      this.subscribeList.set(pubName, tempList);
    }
    if (this.subscribeOnceList !== null && this.subscribeOnceList.has(pubName)) {
      tempList = this.subscribeOnceList.get(pubName);
      tempList = tempList.filter(item => !item.equal(callback, scope));
      this.subscribeOnceList.set(pubName, tempList);
    }
  }
  /**
   * 移除作用域下所有的方法
   * @param scope 作用域
   */
  public offScope(scope: any) {
    this.subscribeList.forEach((value, key) => {
      if (value === void 0 || value === null) return this.subscribeList.delete(key);
      const list = value.filter(item => !item.scopeEqual(scope));
      this.subscribeList.set(key, list);
    });
    this.subscribeOnceList.forEach((value, key) => {
      if (value === void 0 || value === null) return this.subscribeOnceList.delete(key);
      const list = value.filter(item => !item.scopeEqual(scope));
      this.subscribeOnceList.set(key, list);
    });
  }

}

export class Subscribe {
  public name: string;
  private callback: Function;
  private scope: any = null;
  /**
   * 订阅者
   * @param name      订阅的名字
   * @param callback  接收订阅信息的接口
   * @param scope     作用域
   */
  constructor(name: string, callback: Function, scope: any) {
    this.name = name;
    this.callback = callback;
    this.scope = scope === void 0 ? null : scope;
  }
  /**
   * 新消息通知
   * @param data 通知的数据
   */
  public update(...data: any[]) {
    return this.callback.call(this.scope, ...data);
  }
  /**
   * 判断接收订阅信息的接口是否相同
   * @param callback 接收订阅信息的接口
   * @param scope    如果有传作用域，则会判断接收订阅信息的接口并且判断作用域
   */
  public equal(callback: Function, scope?: any): boolean {
    if (scope !== void 0) return scope === this.scope && callback === this.callback;
    return callback === this.callback;
  }
  /**
   * 判断作用域是否相同
   * @param scope 作用域， 如果为null 或 undefined，则永远不相等
   */
  public scopeEqual(scope: any): boolean {
    if (scope === null || undefined) return false;
    return this.scope === scope;
  }
}

