const WebSocket = require('ws');
const {Yaticker} = require('./proto');

const createWs = (tray) => {
  const ws = new WebSocket('wss://streamer.finance.yahoo.com');

  const setTitle = (title) => tray.setTitle(title, { fontType: 'monospaced' });

  ws.onopen = function open() {
    console.log('ws connected');
    ws.send(JSON.stringify({
      subscribe: ['TSLA']
    }));
  };

  ws.onclose = function close() {
    console.log('ws disconnected');
    setTitle('disconnected ⚠️');
  };

  ws.onmessage = function incoming(data) {
    const message = Yaticker.decode(Buffer.from(data.data, 'base64'));

    const { price, changePercent } = message;

    let emoji = changePercent > 0 ? '🟢' : '🔴';

    if (changePercent >= 5) {
      emoji = '🚀'
    }

    if (changePercent <= -5) {
      emoji = '😱'
    }

    setTitle(`$${price.toFixed(2)} (${(price*3).toFixed(2)}) ${emoji} ${changePercent.toFixed(2)}%`);
  };

  return ws;
}

module.exports = {
  createWs,
}
