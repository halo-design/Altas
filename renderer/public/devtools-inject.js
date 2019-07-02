const qs = require('qs');
const { ipcRenderer } = require('electron');

class IPC {
  constructor() {
    this.ipc = ipcRenderer;
    this.emit = this.emit.bind(this);
  }

  on(ev, fn) {
    this.ipc.on(ev, fn);
  }

  emit(ev, data) {
    this.ipc.sendToHost(ev, data);
  }
}


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

window['ALTAS_APP_PARAMS'] = appParams;
window['ALTAS_APP_IPC'] = new IPC();
