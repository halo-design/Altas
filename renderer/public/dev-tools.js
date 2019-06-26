const { ipcRenderer } = require('electron');

ipcRenderer.on('ping', () => {
  ipcRenderer.sendToHost('pong');
})

console.log('inject preload javaScript');

window.author = 'Aford';
