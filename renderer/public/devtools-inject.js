const qs = require('qs');
const uuid = require('uuid');
const { ipcRenderer } = require('electron');

class IPC {
  constructor() {
    this.ipc = ipcRenderer;
    this.emit = this.emit.bind(this);
  }

  on(ev, fn) {
    this.ipc.on(ev, fn);
  }

  once(ev, fn) {
    this.ipc.once(ev, fn);
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

class JSBridge {
  constructor() {
    this.ipc = window.ALTAS_APP_IPC;
  }

  call(fnName, params, callback) {
    if (fnName in this) {
      this[fnName](params, callback);
    } else {
      throw Error('This method is not registered.');
    }
  }

  alertEx(params, callback) {
    const uid = uuid.v4();
    this.ipc.emit('showAlert', {
      title: params.title,
      content: params.message,
      okText: params.okButton,
      cancelText: params.cancelButton,
      uid,
    })
    if (callback) {
      this.ipc.once(uid, (sender, res) => {
        callback(res);
      })
    }
  }

  showInputAlert(params, callback) {
    const uid = uuid.v4();
    this.ipc.emit('showPrompt', {
      title: params.title,
      content: params.message,
      okText: params.okButton,
      cancelText: params.cancelButton,
      defaultValue: params.presetInputContent,
      placeholders: params.placeholder,
      uid,
    })
    if (callback) {
      this.ipc.once(uid, (sender, res) => {
        callback(res);
      })
    }
  }

  showLoadingEx(params) {
    this.ipc.emit('showToastWithLoading', {
      content: params.message,
      duration: params.duration || 8,
      mask: true,
    })
  }

  hideLoadingEx() {
    this.ipc.emit('hideToast');
  }
}

window['AlipayJSBridge'] = new JSBridge();
