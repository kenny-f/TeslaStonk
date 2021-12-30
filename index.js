const { menubar } = require('menubar');
const path = require('path');
const { ipcMain } = require('electron');
const { createWs } = require('./ws');

const isDebug = process.env.DEBUG;

const debugOptions = isDebug
  ? {
    alwaysOnTop: true,
    width: 1000,
    height: 1500,
  }
  : {}

const browserWindowOptions = {
  webPreferences: {
    enableRemoteModule: true,
    overlayScrollbars: true,
    nodeIntegration: true,
    contextIsolation: false,
  },
  height: 500,
  ...debugOptions,
}

const mb = menubar({
  browserWindow: browserWindowOptions,
  icon: path.join(__dirname, 'tesla.png')
});

mb.on('ready', () => {
  let ws = createWs(mb.tray);

  ipcMain.on('pause-ws', () => {
    ws.pause();
    mb.tray.setTitle('');
  });

  ipcMain.on('resume-ws', () => {
    ws.resume()
  });

  ipcMain.on('reconnect-ws', () => {
    ws.terminate();
    ws = createWs(mb.tray);
  });
});

if (isDebug) {
  mb.on('after-create-window', () => { mb.window.openDevTools() })
}
