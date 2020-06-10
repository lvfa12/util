import Port from '@util/Port/index';
console.log('..............................................')
Port.portAvailable(8080).then(res => {
  console.log('端口可用1');
}).catch(console.log);