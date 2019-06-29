const { ipcRenderer } = require('electron');
const qs = require('qs');

const attrFormatter = (val) => {
  if ((/true|false/).test(val)) {
    return eval(val);
  } else if (!isNaN(Number(val))) {
    return Number(val);
  } else {
    return val;
  }
};

const deepFormat = (o) => {
  for (let p in o) {
    if (typeof(o[p]) === 'object') {
      deepFormat(o[p]);
    } else {
      o[p] = attrFormatter(o[p]);
    }
  }
};

const appParams = qs.parse(location.search.substr(1));
deepFormat(appParams);
window.ALTAS_APP_INJECT_PARAMS = appParams;

ipcRenderer.on('dom-ready', () => {
  console.log('webview ready!');
  ipcRenderer.sendToHost('try send message', {
    time: Date.now(),
  });
});

console.log('inject preload javaScript');

window.author = 'Aford';
