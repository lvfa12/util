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
 * @param time 延时时间,默认1500,单位ms
 * @return Promise
 */
export declare function delay(time?: number): Promise<any>;

type ListType = Map<String, Array<Subscribe>>;
type PubListName = "subscribeList" | "subscribeOnceList";

export declare class Publish {
  /**
   * 发布对象
   */
  constructor();
  /** 存储订阅对象 */
  private subscribeList: ListType;
  /** 存储单次订阅的对象 */
  private subscribeOnceList: ListType;
  /**
   * 订阅
   * @param pubName   订阅的名字
   * @param callback  接收订阅信息的接口
   * @param scope     作用域
   * @returns Publish 返回对象本身
   */
  public on(pubName: string, callback: Function, scope?: any): Publish;
  /**
   * 单次订阅
   * @param pubName  订阅的名字
   * @param callback 接收订阅信息的接口
   * @param scope    作用域
   */
  public once(pubName: string, callback: Function, scope?: any): Publish;
  /**
   * 取消订阅
   * @description    如果未传callback，那么将所有的pubName全都取消
   * @param pubName  取消订阅的名字
   * @param callback 接收订阅信息的接口
   * @param scope    作用域
   */
  public off(pubName: string, callback?: Function, scope?: any): Publish;
  /**
   * 触发通知
   * @param pubName           要通知的订阅名称
   * @param ...callbackValue  剩余通知的数据
   */
  public notify(pubName: string, ...callbackValue: any[]): Publish;
  /**
   * 取消所有订阅
   */
  public clear(): Publish;
  /**
   * 向订阅数组添加
   * @param listName 
   * @param name 
   * @param subscribe 
   */
  private pushItem(listName: PubListName, name: string, subscribe: Subscribe): void;
  /**
   * 删除订阅名为[pubName]回调函数为[callback]的订阅
   * @param pubName  订阅名
   * @param callback 接收订阅信息的接口
   * @param scope    作用域
   */
  private removeItem(pubName: string, callback: Function, scope?: any): void;
  /**
   * 移除作用域下所有的方法
   * @param scope 作用域
   */
  public offScope(scope: any): void;
}

export declare class Subscribe {
  /** 订阅名 */
  public name: string;
  /** 订阅通知方法 */
  private callback: Function;
  /** 作用域 */
  private scope: any;
  /**
   * 订阅者
   * @param name      订阅的名字
   * @param callback  接收订阅信息的接口
   * @param scope     作用域
   */
  constructor(name: string, callback: Function, scope: any);
  /**
   * 新消息通知
   * @param data 通知的数据
   */
  public update(...data: any[]): void;
  /**
   * 判断接收订阅信息的接口是否相同
   * @param callback 接收订阅信息的接口
   * @param scope    如果有传作用域，则会判断接收订阅信息的接口并且判断作用域
   */
  public equal(callback: Function, scope?: any): boolean;
  /**
   * 判断作用域是否相同
   * @param scope 作用域， 如果为null 或 undefined，则永远不相等
   */
  public scopeEqual(scope: any): boolean;
}

declare enum WsState {
  '未连接',
  '连接中',
  '已连接',
  '已断开'
}

interface WsConfig {
  /** websocket链接 */
  url?: string,
  /** 后端发回数据的eventName */
  acceptEventName?: string,
  /** 发送给后端时的eventName */
  sendEventName?: string,
  /** 失败重连次数 */
  reConnectNum?: number,
  /** websocket报错后间隔多少时间进行重连,单位秒 */
  reConnectIntervalTime?: number,
  /** 心跳内容 */
  heartbeatContent?: any,
  /** 心跳间隔,单位秒 */
  heartbeatInterval?: number,
}

export declare class Ws extends Publish {
  /** 订阅名称 websocket开启 */
  public static OPEN: string;
  /** 订阅名称 websocket关闭 */
  public static CLOSED: string;
  /** 订阅名称 websocket收到消息 */
  public static MESSAGE: string;
  /** 订阅名称 websocket发生错误 */
  public static ERROR: string;
  /** 订阅名称 websocket重连失败 */
  public static RELINKERROR: string;
  /** websocket 连接状态 */
  private connectState: WsState;
  /** 心跳计时器的id */
  private heartbeatTimeoutId: any;
  /** websocket对象 */
  private _ws: WebSocket;
  /** 要发送给后端时event的key值 **/
  private _sendEventName: string;
  /** 接收后端数据的event的key值 */
  private _acceptEventName: string;
  /** websocket链接 */
  private _wsURL: string;
  /** 出错断线重连的重试次数 */
  private reConnectNum: number;
  /** 出错断线重连的重试次数计数 */
  private _reConnectNum: number;
  /** 重连的定时器id */
  private reConnectNumTimeout: any;
  /** 重连的间隔时间 */
  private reConnectIntervalTime: number;
  /** 心跳内容 */
  private heartbeatContent: string;
  /** 心跳间隔 */
  private heartbeatInterval: number;
  /** 请求id */
  private requestId: number;
  /**
   * 继承了发布订阅的websocket
   * @param config 配置项
   */
  constructor(config?: WsConfig);
  /**
   * 连接websocket
   * @param url websocket链接
   */
  public connect(url: string): Ws;
  /**
   * 在socket开启后调用
   * @param event websocket 开启事件的event对象
   */
  private onopen(event: Event): void;
  /**
   * 在socket关闭后调用
   * @param event websocket 关闭事件的event对象
   */
  private onclose(event: CloseEvent): void;
  /**
   * 在socket接收到消息后调用
   * @param message websocket 接收到信息的event对象
   */
  private onmessage(message: MessageEvent): void;
  /**
   * 在socket报错后调用
   * @param event websocket 报错的event对象
   */
  private onerror(event: Event): void;
  /**
   * 通过socket发送事件
   * @param eventName 发送的事件名
   * @param data      发送的数据
   */
  public send(eventName: string, data: any): void;
  /**
   * 开启心跳
   */
  private startHeartbeat(): void;
  /**
   * 结束心跳
   */
  private endHeartbeat(): void;
  /**
   * 报错后重连
   */
  private relink(): void;
  /**
   * 关闭websocket
   */
  public close(): void;
  /**
   * 单次请求
   * @description     发送单次请求，需要后端配合
   * @param eventName 请求的事件名
   * @param data      请求的数据
   * @param callback  收到请求后的回调
   * @param scope     回调的作用域
   * @return 返回订阅的消息名，用于取消请求
   */
  public request(eventName: string, data: any, callback: Function, scope?: any): string;
  /**
   * 销毁对象的使用
   */
  public destroy(): void;
}
/**
 * 数据类型相关
 * ```
 * # 方法
 * getType ------------------------------------------
 * DataType.getType("abc");       // "string"
 * DataType.getType(123);         // "number"
 * DataType.getType(true);        // "boolean"
 * DataType.getType([]);          // "array"
 * DataType.getType({});          // "object"
 * DataType.getType(null);        // "null"
 * DataType.getType(undefined);   // "undefined"
 * DataType.getType(Symbol());    // "Symbol"
 * DataType.getType(Bigint(10));  // "bigint"
 * is -----------------------------------------------
 * DataType.is("abc", "string")   // true
 * DataType.is(123,   "number")   // false
 * ```
 */
export declare class DataType {
  /**
   * 判断是否为某一数据类型
   * @param data 需要判断类型的值
   * @param type 类型
   */
  public static is(data: any, type: string): boolean;
  /**
   * 获取数据类型
   * @param data 需要判断类型的值
   */
  public static getType(data: any): string;

}

/**
 * 倒计时的执行模式
 * @type MODE_TIME_END   传入结束时间来进行倒计时的模式
 * @type MODE_SEC_TIME   传入倒计时秒数来进行倒计时
 */
type runingMode = 'MODE_TIME_END' | 'MODE_SEC_TIME';
/**
 * 倒计时
 * @property startTime  开始时间
 * @property endTime    结束时间
 * @property countDown  一共倒计时几秒 
 */
export interface countDownOptions {
  startTime?: number,
  endTime?: number,
  countDown?: number,
}

export declare class CountDown extends Publish {
  /** 倒计时结束触发的事件名 */
  public static COUNT_DOWN_END: string;
  /** 倒计时开始的事件名 */
  public static COUNT_DOWN_START: string;
  /** 倒计时间隔触发时的事件名 */
  public static COUNT_DOWN_TRIGGER: string;
  /** 倒计时函数 */
  constructor()
  /** 倒计时模式, 以传入结束时间来进行倒计时的模式 */
  public static MODE_TIME_END: runingMode;
  /** 倒计时模式, 以传入倒计时秒数的方式来进行倒计时的模式 */
  public static MODE_SEC_TIME: runingMode;
  /** 剩余的秒数 */
  private surplusTime;
  /** 上次触发的时间戳 */
  private pretiggerTime;
  /** 是否被占用 */
  private _isRuning: boolean;
  /** 定时器的id */
  private timeOut: NodeJS.Timeout | number;
  /** 触发间隔 */
  public triggerInterval: number;
  /** 步长 */
  public stepLength: number;
  /** 使isRuning只读 */
  public readonly isRuning;
  /**
   * 开始倒计时
   * @param mode     以什么模式运行
   * @param options  执行倒计时所需的参数
   */
  public start(mode: runingMode, options: countDownOptions): void;
  /**
   * 传入结束时间戳
   * @param endTime  结束时的13位时间戳
   */
  private modeTimeEndStart(endTime: number): void;
  /**
   * 传入秒数进行倒计时
   * @param time       倒计时时间,单位为s
   * @param startTime  开始时间
   */
  private modeSecTimeStart(time: number, startTime?: number): void;
  /**
   * 倒计时
   * @param triggerInterval 间隔时间
   */
  private countDown(triggerInterval): void;
  /**
   * 重置倒计时对象, 并且会清空所有监听
   * @param noResetSetting 传入false将重置设置的参数
   */
  public reset(noResetSetting?: boolean): void;
  /**
   * 初始化
   */
  private init(): void;
  /**
   * 销毁对象，解绑订阅,终止倒计时
   */
  public destroy(): void;
}



type formatType = "number" | "string" | "array" | "boolean" | "object" | "tuple";

export interface formatInterface {
  /** 数据类型 */
  type: formatType;
  /** 属性对应的key值 */
  key?: string;
  /** 默认值 */
  default?: any;
  /** rule在type值为array,object,tuple 时生效  */
  rule?: formatInterface | Array<formatInterface>
}

/**
 * 格式化数据, 根据传入的格式化参数获取对应的数据
 * @param data    需要被格式化的数据
 * @param format  格式化规则
 */
export function formatData(data: any, format: formatInterface): any;