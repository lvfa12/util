import { Publish } from '@util/PubSub/index';

// const pub = new Publish();

// pub.on('aaa', (res: any) => {
//   console.log()
// });

class Main {
  public pub: Publish = null;
  constructor() {
    this.pub = new Publish();
    this.init();
    this.start();
  }
  public init() {
    this.pub.on("aaa", this.onAAA, this);
    this.pub.once("bbb", this.onBBB, this);
  }
  onAAA(res: any) {
    console.log('aaa', res);
  }
  onBBB(res: any) {
    console.log("bbb", res);
  }
  start() {
    this.pub.notify('aaa', "发给aaa的信息1");
    this.pub.notify('aaa', "发给aaa的信息2");
    this.pub.notify('bbb', "发给bbb的信息1");
    this.pub.notify('bbb', "发给bbb的信息2");
  }
}


new Main();