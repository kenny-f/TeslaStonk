const WebSocket = require('ws');
const {Yaticker} = require('./proto');
const {ipcRenderer} = require('electron');

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
    ipcRenderer.send('reconnect-ws')
  };

  ws.onmessage = function incoming(data) {
    const message = Yaticker.decode(Buffer.from(data.data, 'base64'));
  
    const { price, change, changePercent } = message;

    const emoji = changePercent > 0 ? '🟢' : '🔴';

    tray.setTitle(`$${price.toFixed(2)} ${emoji} ${changePercent.toFixed(2)}%`);
  };

  return ws;
}

module.exports = {
  createWs,
}