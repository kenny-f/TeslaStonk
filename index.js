const { menubar } = require('menubar');
const path = require('path');
const { ipcMain, powerMonitor, globalShortcut } = require('electron');
const { createWs } = require('./ws');

const isDebug = process.env.DEBUG;

const debugOptions = isDebug
  ? {
    alwaysOnTop: true,
  }
  : {}

const browserWindowOptions = {
  webPreferences: {
    enableRemoteModule: true,
    overlayScrollbars: true,
    nodeIntegration: true,
    contextIsolation: false,
  },
  height: 750,
  ...debugOptions,
}

let isWindowOpen = false;

const mb = menubar({
  browserWindow: browserWindowOptions,
  icon: path.join(__dirname, 'tesla.png')
});

mb.on('ready', () => {
  let ws = createWs(mb.tray);

  globalShortcut.register('Control+Alt+T', () => {
    if(isWindowOpen) {
      mb.hideWindow()
      isWindowOpen = !isWindowOpen;
    } else {
      mb.showWindow()
      isWindowOpen = !isWindowOpen;
    }
  })

  ipcMain.on('pause-ws', () => {
    ws.pause();
    mb.tray.setTitle('paused');
  });

  ipcMain.on('resume-ws', () => {
    ws.resume()
  });

  ipcMain.on('reconnect-ws', () => {
    ws.terminate();
    ws = createWs(mb.tray);
  });
  
  powerMonitor.on('suspend', () => {
    ws.terminate();
  })
  
  powerMonitor.on('resume', () => {
    console.log('resume')
    ws = createWs(mb.tray);
  })
});

// mb.on('after-create-window', async () => { 
//   console.log('after create')
// })

mb.on('after-show', async () => {
  mb.window.send('render-data')
})

mb.on('after-hide', async () => {
  mb.window.send('window-hide')
})