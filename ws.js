const WebSocket = require('ws');
const {Yaticker} = require('./proto');

const createWs = (tray) => {
  const ws = new WebSocket('wss://streamer.finance.yahoo.com');

  ws.onopen = function open() {
    console.log('ws connected');
    ws.send(JSON.stringify({
      subscribe: ['TSLA']
    }));
  };

  ws.onclose = function close() {
    console.log('ws disconnected');
  };

  ws.onmessage = function incoming(data) {
    const message = Yaticker.decode(Buffer.from(data.data, 'base64'));
  
    const { price, change, changePercent } = message;

    tray.setTitle(`$${price.toFixed(2)}`);
  };

  return ws;
}

module.exports = {
  createWs,
}