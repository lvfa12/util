import { CountDown } from "@util/CountDown/index";   // 倒计时

const count_down = new CountDown();

count_down.on(CountDown.COUNT_DOWN_START, function (e) {
  console.log('开始倒计时', e);
});

count_down.on(CountDown.COUNT_DOWN_END, function (e) {
  console.log('倒计时结束', e)
});




const a = document.createElement('button')
a.innerText = "开始倒计时"
document.body.appendChild(a)

count_down.on(CountDown.COUNT_DOWN_TRIGGER, function (e) {
  a.innerText = '倒计时' + e;
});
a.onmousedown = () => {
  count_down.start(CountDown.MODE_TIME_END, { startTime: Date.now(), countDown: 20, endTime: Date.now() + 60500 });

}

console.log(count_down);

