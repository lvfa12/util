const net = require('net');

export default class Port {
  /**
   * 判断端口是否可用
   * @param port 被检查的端口
   */
  public static portAvailable(port: number): Promise<string> {
    console.log(port)
    return new Promise((rev, rej) => {
      const server = new net.createServer();
      server.on('listening', () => {
        server.close();
        console.log('listening');
        rev(`端口：${port} 未被占用`);
      });
      server.on('error', () => {
        console.log('error');
        rej(`端口：${port} 已被占用`);
      });

      server.listen(port);
    })
  }
}