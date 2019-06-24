import * as qs from 'qs';
const QRcode = require('qrcode');
const win = require('electron').remote.getCurrentWindow();
const { getEl, bindClick } = require('../public/utils');
const options = qs.parse(location.hash.substr(1));
const {
  target,
  descriptors: {
    viewport: { width, height },
    userAgent,
  },
  preload,
  insertCSS,
  // insertText,
} = options;

import '../public/loading.scss';
import './index.scss';

const webview = getEl('view');
const closeBtn = getEl('closeBtn');
const debugBtn = getEl('debugBtn');
const reloadBtn = getEl('reloadBtn');
const nextBtn = getEl('nextBtn');
const backBtn = getEl('backBtn');
const porBtn = getEl('porBtn');
const qrBtn = getEl('qrBtn');
const mask = getEl('mask');
const tarIpt = getEl('tarIpt');
const qrcode = getEl('qrcode');
const qrCanvas = qrcode.getElementsByTagName('canvas')[0];

const backClass = backBtn.classList;
const nextClass = nextBtn.classList;
const debugClass = debugBtn.classList;
const maskClass = mask.classList;
const qrcodeClass = qrcode.classList;
const qrBtnClass = qrBtn.classList;

let devtoolState = false;
let panelReady = false;

document.addEventListener(
  'click',
  () => {
    qrcodeClass.remove('show');
    qrBtnClass.remove('active');
  },
  false
);

const setSize = (w: number, h: number) => {
  webview.style.cssText = `width: ${w}px; height: ${h - 80}px`;
};

const webviewBind = (event: any, fn: Function) => {
  webview.addEventListener(event, fn);
};

const isClickabled = () => {
  webview.canGoBack()
    ? backClass.remove('disabled')
    : backClass.add('disabled');
  webview.canGoForward()
    ? nextClass.remove('disabled')
    : nextClass.add('disabled');
};

const bindInit = () => {
  if (panelReady) {
    return;
  }
  panelReady = true;
  if (insertCSS) {
    webview.insertCSS(insertCSS);
  }
  maskClass.add('hide');

  bindClick(nextBtn, () => webview.goForward());
  bindClick(backBtn, () => webview.goBack());
  bindClick(reloadBtn, () => webview.reloadIgnoringCache());
  bindClick(closeBtn, () => win.close());
  bindClick(porBtn, () => visit());
  bindClick(debugBtn, () => {
    if (maskClass.contains('hide')) {
      devtoolState ? webview.closeDevTools() : webview.openDevTools();
      devtoolState = !devtoolState;
    }
  });
  bindClick(qrBtn, () => {
    if (qrBtnClass.contains('active')) {
      qrcodeClass.remove('show');
      qrBtnClass.remove('active');
    } else if (tarIpt.value) {
      QRcode.toCanvas(qrCanvas, tarIpt.value, {
        width: 180,
        margin: 0,
      }).then(() => {
        qrcodeClass.add('show');
        qrBtnClass.add('active');
      });
    }
  });
};

const init = () => {
  webview.setAttribute('preload', preload);
  webview.setAttribute('useragent', userAgent);
  setSize(width, height);
};

const visit = (lnk?: string) => {
  if (lnk) {
    tarIpt.value = lnk;
  }

  if (tarIpt.value) {
    !panelReady && maskClass.remove('hide');
    webview.setAttribute('src', tarIpt.value);
  }
};

init();
visit(target);

webviewBind('devtools-opened', () => {
  debugClass.add('active');
});
webviewBind('devtools-closed', () => {
  debugClass.remove('active');
});
webviewBind('did-navigate-in-page', (ev: any) => {
  if (ev) {
    isClickabled();
    tarIpt.value = ev.url;
  }
});

webview.addEventListener('dom-ready', () => {
  isClickabled();
  bindInit();
});

win.show();
