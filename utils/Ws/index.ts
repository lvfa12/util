import { Publish } from '../PubSub/index';
/**
 * websocket的状态
 */
export enum WsState {
  '未连接',
  '连接中',
  '已连接',
  '已断开'
}

interface WsConfig {
  url?: string,                   // websocket链接
  acceptEventName?: string,       // 后端发回数据的eventName
  sendEventName?: string,         // 发送给后端时的eventName
  reConnectNum?: number,          // 失败重连次数
  reConnectIntervalTime?: number, // websocket报错后间隔多少时间进行重连,单位秒
  heartbeatContent?: any,         // 心跳内容
  heartbeatInterval?: number,     // 心跳间隔,单位秒

}

export class Ws extends Publish {
  public static OPEN: string = "OPEN";
  public static CLOSED: string = "ClOSED";
  public static MESSAGE: string = "MESSAGE";
  public static ERROR: string = 'ERROR';
  public static RELINKERROR: string = 'RELINKERROR';
  /** websocket 连接状态 */
  private connectState: WsState = null;
  // 心跳计时器的id
  private heartbeatTimeoutId: any = null;
  // websocket对象
  private _ws: WebSocket = null;
  /** 要发送给后端时event的key值 **/
  private _sendEventName: string;
  /** 接收后端数据的event的key值 */
  private _acceptEventName: string;
  /** websocket链接 */
  private _wsURL: string = null;
  // 出错断线重连的重试次数
  private reConnectNum: number = 0;
  // 出错断线重连的重试次数计数
  private _reConnectNum: number;
  private reConnectNumTimeout: any = null;
  private reConnectIntervalTime: number;
  private heartbeatContent: string;
  private heartbeatInterval: number;
  private requestId: number = 0;
  /**
   * websocket 发布订阅模式
   */
  constructor(config: WsConfig = {}) {
    super();
    this.connectState = WsState['未连接'];
    this._sendEventName = config.sendEventName || "event";
    this._acceptEventName = config.acceptEventName || "event";
    this._reConnectNum = config.reConnectNum >= 0 ? config.reConnectNum : 0;
    this.reConnectNum = this._reConnectNum;
    this.heartbeatContent = config.heartbeatContent || 'ping';
    this.heartbeatInterval = (config.heartbeatInterval || 20) * 1000;
    this.reConnectIntervalTime = (config.reConnectIntervalTime || 1) * 1000;
    if (config.url !== void 0) this.connect(config.url);
  }
  /**
   * 连接websocket
   * @param url websocket链接
   */
  public connect(url: string):Ws {
    if (url == void 0) throw new Error("请填写websocket链接");
    if (this.connectState === WsState['已连接']) return this;
    this.connectState = WsState['连接中'];
    this._wsURL = url;
    this._ws = new WebSocket(url);
    this._ws.onopen = this.onopen = this.onopen.bind(this);
    this._ws.onclose = this.onclose = this.onclose.bind(this);
    this._ws.onmessage = this.onmessage = this.onmessage.bind(this);
    this._ws.onerror = this.onerror = this.onerror.bind(this);
    return this;
  }
  /**
   * 在socket开启后调用
   * @param event websocket 开启事件的event对象
   */
  private onopen(event: Event) {
    this.connectState = WsState['已连接'];
    this._reConnectNum = this.reConnectNum;
    this.startHeartbeat();
    this.notify(Ws.OPEN, event);
  }
  /**
   * 在socket关闭后调用
   *  @param event websocket 关闭事件的event对象
   */
  private onclose(event: CloseEvent) {
    this.connectState = WsState['已断开'];
    this.endHeartbeat();
    this.notify(Ws.CLOSED, event);
  }
  /**
   * 在socket接收到消息后调用
   * @param message websocket 接收到信息的event对象
   */
  private onmessage(message: MessageEvent) {
    if (typeof message.data === "string") {
      const res = JSON.parse(message.data); // 解包
      this.notify(res[this._acceptEventName], res.data) // 将信息发送到总线上，通知订阅者
    } else {
      // 其他数据类型
      console.log('接收到暂时无法处理的数据', message.data);
    }
    this.notify(Ws.MESSAGE, message);
  }
  /**
   * 在socket报错后调用
   * @param event websocket 报错的event对象
   */
  private onerror(event: Event) {
    this.relink(); // socket
    this.notify(Ws.ERROR, event);
  }
  /**
   * 通过socket发送事件
   * @param eventName 发送的事件名
   * @param data      发送的数据
   */
  public send(eventName: string, data: any) {
    if (this.connectState !== WsState['已连接']) return;
    const requestData = {
      [this._sendEventName]: eventName,
      data: data,
    };
    this._ws.send(JSON.stringify(requestData));
  }
  /**
   * 开启心跳
   */
  private startHeartbeat() {
    this.heartbeatTimeoutId = setInterval(() => {
      this._ws.send(this.heartbeatContent);
    }, this.heartbeatInterval);
  }
  /**
   * 结束心跳
   */
  private endHeartbeat() {
    clearInterval(this.heartbeatTimeoutId);
  }
  /**
   * 报错后重连
   */
  private relink() {
    if (this.reConnectNum === 0) return; // 如果重试次数为0
    this.reConnectNumTimeout = setTimeout(() => {
      if (this._reConnectNum--) {
        this.connect(this._wsURL); // 调用重连
      } else {
        this.notify(Ws.RELINKERROR, null); // 超过尝试次数将停止重连
      }
    }, this.reConnectIntervalTime);
  }
  /**
   * 关闭websocket
   */
  public close() {
    if (this.connectState === WsState['未连接'] || this.connectState === WsState['已断开']) return;
    this._ws.close();
  }
  /**
   * 单次请求
   * @param eventName 请求的事件名
   * @param data      请求的数据
   * @param callback  收到请求后的回调
   * @param scope     回调的作用域
   */
  public request(eventName: string, data: any, callback: Function, scope: any = null): string {
    if (this.connectState !== WsState['已连接']) return;
    const reqId = this.requestId++;
    const requestData = {
      [this._sendEventName]: "once",
      id: reqId,
      onceEvent: eventName,
      data: data,
    };
    this._ws.send(JSON.stringify(requestData));
    const reqEventName = `${eventName}-${reqId}`;
    this.once(reqEventName, callback, scope);
    return reqEventName;
  }
  /**
   * 销毁对象的使用
   */
  public destroy() {
    clearTimeout(this.reConnectNumTimeout);
    this.close();
    this.clear();
    this.endHeartbeat();
    this._ws = null;
  }
}

