import * as qs from 'qs';
const QRcode = require('qrcode');
import { getEl, bindClick } from '../public/utils';
const win = require('electron').remote.getCurrentWindow();
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

const webview: any = getEl('view');
const closeBtn: any = getEl('closeBtn');
const debugBtn: any = getEl('debugBtn');
const reloadBtn: any = getEl('reloadBtn');
const nextBtn: any = getEl('nextBtn');
const backBtn: any = getEl('backBtn');
const porBtn: any = getEl('porBtn');
const qrBtn: any = getEl('qrBtn');
const mask: any = getEl('mask');
const tarIpt: any = getEl('tarIpt');
const qrcode: any = getEl('qrcode');
const qrCanvas: any = qrcode.getElementsByTagName('canvas')[0];

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
  preload && webview.setAttribute('preload', preload);
  userAgent && webview.setAttribute('useragent', userAgent);
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
