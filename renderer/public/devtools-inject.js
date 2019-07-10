const qs = require('qs');
const url = require('url');
const uuid = require('uuid');
const { ipcRenderer } = require('electron');

const urlElement = url.parse(location.href);

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

const deafultErrorRes = {
  error: '0',
  errorMessage: '',
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
    if (fnName === 'call') {
      return;
    }
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
        callback({
          ...res,
          ...deafultErrorRes,
        });
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
        callback({
          ...res,
          ...deafultErrorRes,
        });
      })
    }
  }

  showLoadingEx(params, callback) {
    this.ipc.emit('showToastWithLoading', {
      content: params.message,
      duration: params.duration || 8,
      mask: true,
    })
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  hideLoadingEx(params, callback) {
    this.ipc.emit('hideToast');
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  closePage(params, callback) {
    const { closeType, urls } = params;
    if (closeType === 1) {
      this.ipc.emit('clearAllWebviews');
    } else if (closeType === 2) {
      this.ipc.emit('clearOtherWebviews');
    } else if (closeType === 3) {
      this.ipc.emit('clearCurrentWebview');
    } else if (closeType === 4) {
      this.ipc.emit('clearWebviewByPathName', {
        url: urls,
      });
    }
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  closeToPage(params, callback) {
    this.ipc.emit('clearToSomeoneWebview', params);
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  closeToHomePage(params, callback) {
    this.ipc.emit('clearAllWebviews');
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  pushWindow(params, callback) {
    const { url, param } = params;
    this.ipc.emit('createNewWebview', {
      url,
      options: param,
    })
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  startH5App(params, callback) {
    this.pushWindow(params);
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  clearHistory(params, callback) {
    this.ipc.emit('clearFocusWebviewHistory');
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  setStorageCache(params, callback) {
    this.ipc.emit('setStorage', {
      host: urlElement.host,
      key: params.key,
      data: params.data,
    })
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  getStorageCache(params, callback) {
    const uid = uuid.v4();
    this.ipc.emit('getStorage', {
      host: urlElement.host,
      key: params.key,
      uid,
    })
    this.ipc.once(uid, (sender, res) => {
      callback({
        data: res.data,
        ...deafultErrorRes,
      });
    })
  }

  setMemoryCache(params, callback) {
    this.ipc.emit('setSessionStorage', {
      host: urlElement.host,
      key: params.key,
      data: params.data,
    })
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  getMemoryCache(params, callback) {
    const uid = uuid.v4();
    this.ipc.emit('getSessionStorage', {
      host: urlElement.host,
      key: params.key,
      uid,
    })
    this.ipc.once(uid, (sender, res) => {
      callback({
        data: res.data,
        ...deafultErrorRes,
      });
    })
  }

  showDatePicker(params, callback) {
    const uid = uuid.v4();
    this.ipc.emit('showDatePicker', {
      mode: params.type === '1' ? 'time' : 'date',
      title: params.title,
      minDate: params.minimumDate,
      maxDate: params.maximumDate,
      dateFormat: params.dateFormat,
      value: params.currentDate,
      uid,
    })
    this.ipc.once(uid, (sender, res) => {
      callback({
        ...res,
        ...deafultErrorRes,
      });
    })
  }
}

window['AlipayJSBridge'] = new JSBridge();
