const { ipcRenderer } = require('electron');

ipcRenderer.on('dom-ready', () => {
  console.log('webview ready!');
  ipcRenderer.sendToHost('try send message', {
    time: Date.now(),
  });
})

console.log('inject preload javaScript');

window.author = 'Aford';
