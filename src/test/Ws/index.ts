import { Ws,a } from '@util/Ws/index';

const ws = new Ws({
  reConnectNum: 10,
});

ws.on(Ws.MESSAGE, (e: any) => {
  console.log(e, "message");
});

ws.on(Ws.OPEN, (e: any) => {
  console.log(e, "open")
  ws.request("aaa", { key: 1 }, (e: any) => {
    console.log(e);
  })
});

ws.on(Ws.CLOSED, (e: any) => console.log(e, "close"));

ws.on(Ws.ERROR, (e: any) => console.log(e, "error"));

ws.on(Ws.RELINKERROR, (e: any) => {
  console.log('重连失败');
})
ws.on('bbb', ((e: any) => {
  console.log('接收到bbb的信息', e)
}))

ws.connect('ws://localhost:8085');

console.log(a.c);