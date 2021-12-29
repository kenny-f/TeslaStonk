const {ipcRenderer} = require('electron');

document.getElementById('resume').onclick = () => {
  ipcRenderer.send('resume-ws')
}

document.getElementById('pause').onclick = () => {
  ipcRenderer.send('pause-ws')
}

document.getElementById('reconnect').onclick = () => {
  ipcRenderer.send('reconnect-ws')
}
