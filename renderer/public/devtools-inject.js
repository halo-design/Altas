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

const deepReplaceKey = (o, sourceKeyName, targetKeyName) => {
  for (let p in o) {
    if (p == sourceKeyName) {
      o[targetKeyName] = o[p];
      delete o[p];
    }

    if (typeof(o[p]) === 'object') {
      deepReplaceKey(o[p], sourceKeyName, targetKeyName);
    }
  }
}

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
    let pickerType = 'date';

    switch (params.type) {
      case '0': {
        pickerType = 'date';
        break;
      }

      case '1': {
        pickerType = 'time';
        break;
      }

      case '2': {
        pickerType = 'datetime';
        break;
      }
    }

    this.ipc.emit('showDatePicker', {
      mode: pickerType,
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

  showPickerView(params, callback) {
    const uid = uuid.v4();
    const { dataSource, title, defaultValue } = params;

    if (defaultValue) {
      deepReplaceKey(defaultValue, 'name', 'label');
    }

    if (dataSource) {
      deepReplaceKey(dataSource, 'name', 'label');
    }

    this.ipc.emit('showPicker', {
      title: title,
      data: dataSource,
      value: defaultValue,
      uid,
    })

    this.ipc.once(uid, (sender, { result, actionType }) => {
      deepReplaceKey(result, 'name', 'label');
      callback({
        result,
        actionType,
        ...deafultErrorRes,
      });
    })
  }

  startPullDownRefresh(params, callback) {
    this.ipc.emit('toogleRefresh', true);
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  stopPullDownRefresh(params, callback) {
    this.ipc.emit('toogleRefresh', false);
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  showToast(params, callback) {
    this.ipc.emit('showToast', params);
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  showMask(params, callback) {
    this.ipc.emit('setNavBarMask', {
      visible: true,
      color: params.maskColor,
    })
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  hideMask(params, callback) {
    this.ipc.emit('setNavBarMask', {
      visible: false,
      color: '',
    })
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  setMenu(side, params, callback) {
    const uid = uuid.v4();
    let menuArr = [];
    if ('menus' in params) {
      menuArr = params.menus.map(item => {
        item['uid'] = uid;
        return item;
      })
    } else {
      menuArr.push({
        uid,
        ...params,
      })
    }
    this.ipc.emit('setMenu', {
      diretion: side,
      menus: menuArr,
    })
    this.ipc.on(uid, (sender, res) => {
      callback({
        index : res.index,
        ...deafultErrorRes,
      });
    })
  }

  setLeftMenu(params, callback) {
    this.setMenu('left', params, callback);
  }

  setRightMenu(params, callback) {
    this.setMenu('right', params, callback);
  }

  showLeftMenu(params, callback) {
    this.ipc.emit('setMenuVisible', {
      direction: 'left',
      visible: params.show,
    })
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  setMiddleTitle(params, callback) {
    this.ipc.emit('setMiddleTitle', params);
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  setBarBottomLineColor(params, callback) {
    this.ipc.emit('setNavBarBottomLineColor', params);
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  showTitleBar(params, callback) {
    this.ipc.emit('setNavBarVisible', { visible: true, });
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  hideTitleBar(params, callback) {
    this.ipc.emit('setNavBarVisible', { visible: false, });
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  setTitleBarColor(params, callback) {
    this.ipc.emit('setNavBarBgColor', params);
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  getStatusBarHeight(params, callback) {
    if (callback) {
      callback({
        statusBarHeight: '0',
        ...deafultErrorRes,
      });
    }
  }

  getTitleBarHeight(params, callback) {
    if (callback) {
      callback({
        titleBarHeight: '40',
        ...deafultErrorRes,
      });
    }
  }

  setStatusBarStyle(params, callback) {
    if (callback) {
      callback(deafultErrorRes);
    }
  }

  showActionSheet(params, callback) {
    const uid = uuid.v4();
    const { title, items } = params;
    const maxIndex = items.length - 1;
    this.ipc.emit('showActionSheet', {
      uid,
      title,
      items,
    })
    this.ipc.once(uid, (sender, res) => {
      const { selectIndex } = res;
      if (selectIndex > maxIndex) {
        callback({
          selectIndex: '',
          selectItem: '',
          error: '2000',
          errorMessage: '',
        });
      } else {
        callback({
          selectItem: items[selectIndex],
          selectIndex: String(selectIndex),
          ...deafultErrorRes,
        });
      }
    })
  }
}

window['AlipayJSBridge'] = new JSBridge();
