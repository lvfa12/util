import { Publish } from '@util/PubSub/index';
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
export class CountDown extends Publish {
  /** 倒计时结束触发的事件名 */
  public static COUNT_DOWN_END: string = "COUNT_DOWN_END";
  /** 倒计时开始的事件名 */
  public static COUNT_DOWN_START: string = "COUNT_DOWN_START";
  /** 倒计时间隔触发时的事件名 */
  public static COUNT_DOWN_TRIGGER: string = "COUNT_DOWN_TRIGGER";
  /** 倒计时函数 */
  constructor() { super(); this.init(); }
  /** 倒计时模式, 以传入结束时间来进行倒计时的模式 */
  public static MODE_TIME_END: runingMode = "MODE_TIME_END";
  /** 倒计时模式, 以传入倒计时秒数的方式来进行倒计时的模式 */
  public static MODE_SEC_TIME: runingMode = "MODE_SEC_TIME";
  // 剩余的秒数
  private surplusTime = 0;
  // 上次触发的时间戳
  private pretiggerTime = 0
  // 是否被占用
  private _isRuning: boolean = false;
  // 定时器的id
  private timeOut: NodeJS.Timeout | number = -1;
  // 触发间隔
  public triggerInterval: number = 1000;
  // 步长
  public stepLength: number = 1;
  // 使isRuning只读
  public get isRuning() {
    return this._isRuning;
  }
  /**
   * 开始倒计时
   * @param mode     以什么模式运行
   * @param options  执行倒计时所需的参数
   */
  public start(mode: runingMode, options: countDownOptions) {
    if (this.isRuning === true) throw new Error('当前倒计时正在运行中');
    this._isRuning = true;
    switch (mode) {
      case CountDown.MODE_TIME_END:
        this.modeTimeEndStart(options.endTime);
        break;
      case CountDown.MODE_SEC_TIME:
        this.modeSecTimeStart(options.countDown, options.startTime);
        break;
    }
  }
  /**
   * 传入结束时间戳
   * @param endTime  结束时的13位时间戳
   */
  private modeTimeEndStart(endTime: number) {
    if (endTime === void 0) throw new Error('请传入endTime');
    this.pretiggerTime = Date.now();
    if (endTime < this.pretiggerTime) {
      this.notify(CountDown.COUNT_DOWN_START, 0);
      return this.notify(CountDown.COUNT_DOWN_END, 0);
    }
    this.surplusTime = Math.floor((endTime - this.pretiggerTime) / this.triggerInterval);
    this.notify(CountDown.COUNT_DOWN_START, this.surplusTime);
    const nextTime = this.triggerInterval - (endTime - this.pretiggerTime) % this.triggerInterval;
    this.pretiggerTime -= (this.triggerInterval - nextTime);
    this.timeOut = setTimeout(() => this.countDown(this.triggerInterval * 2), nextTime);
  }
  // 传入秒数进行倒计时
  private modeSecTimeStart(time: number, startTime: number = Date.now()) {
    startTime = Number(startTime);
    if (time === void 0) throw new Error('请传入倒计时时间，单位为秒');
    if (Number.isNaN(startTime)) throw new Error(`startTime参数错误: ${startTime}`);
    if (time <= 0) {
      this.notify(CountDown.COUNT_DOWN_START, 0);
      return this.notify(CountDown.COUNT_DOWN_END, 0);
    }
    const nowTime = Date.now(); // 当前时间
    const surplusTime = time - Math.floor((nowTime - startTime) / this.triggerInterval)
    if (surplusTime <= 0) {
      this.notify(CountDown.COUNT_DOWN_START, 0);
      return this.notify(CountDown.COUNT_DOWN_END, 0);
    }
    const nextTime = this.triggerInterval - (nowTime - startTime) % this.triggerInterval;
    this.surplusTime = surplusTime;
    this.notify(CountDown.COUNT_DOWN_START, this.surplusTime);
    // 记录上次触发时间
    this.pretiggerTime = nowTime - (this.triggerInterval - nextTime);
    this.timeOut = setTimeout(() => this.countDown(this.triggerInterval * 2), nextTime);
  }
  // 倒计时
  private countDown(triggerInterval) {
    this.surplusTime -= this.stepLength;
    this.notify(CountDown.COUNT_DOWN_TRIGGER, this.surplusTime);
    if (this.surplusTime === 0 || this.surplusTime < 0) return this.notify(CountDown.COUNT_DOWN_END, this.surplusTime);
    const nowDate = Date.now()
    const nextTime = triggerInterval - (nowDate - this.pretiggerTime);
    this.pretiggerTime = nowDate - (this.triggerInterval - nextTime);
    this.timeOut = setTimeout(() => this.countDown(triggerInterval), nextTime);
  }
  /**
   * 重置倒计时对象, 并且会清空所有监听
   * @param noResetSetting 传入false将重置设置的参数
   */
  public reset(noResetSetting: boolean = true) {
    clearTimeout(this.timeOut as number);
    this.clear();
    this.surplusTime = 0;
    this.pretiggerTime = 0;
    this.timeOut = -1;
    if (noResetSetting === false) {
      this.triggerInterval = 1000;
      this.stepLength = 1;
    }
    this.init();
  }
  /**
   * 初始化
   */
  private init() {
    this.on(CountDown.COUNT_DOWN_END, function () {
      this._isRuning = false; // 重置为false，使倒计时能够重新被使用
    }, this);
  }
  /**
   * 销毁对象，解绑订阅,终止倒计时
   */
  public destroy() {
    clearTimeout(this.timeOut as number);
    this.clear();
  }
}

