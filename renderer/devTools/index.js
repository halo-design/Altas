const qs = require('qs');
const win = require('electron').remote.getCurrentWindow();
const getEl = id => document.getElementById(id);
const options = qs.parse(location.hash.substr(1));
const { target, descriptors: { viewport: { width, height }, userAgent }, preload, insertCSS, insertText  } = options;

const webview = getEl('view');
const closeBtn = getEl('closeBtn');
const debugBtn = getEl('debugBtn');
const reloadBtn = getEl('reloadBtn');
const nextBtn = getEl('nextBtn');
const backBtn = getEl('backBtn');
const porBtn = getEl('porBtn');
const mask = getEl('mask');
const tarIpt = getEl('tarIpt');

const backClass = backBtn.classList;
const nextClass = nextBtn.classList;
const debugClass = debugBtn.classList;
const maskClass = mask.classList;

let devtoolState = false;
let panelReady = false;

const setSize = (w, h) => {
  webview.style.cssText = `width: ${w}px; height: ${h - 80}px`
}

const bindClick = (el, fn) => {
  el.addEventListener('click', e => {
    fn();
    e.stopPropagation();
  }, false);
}

const webviewBind = (event, fn) => {
  webview.addEventListener(event, fn);
}

const isClickabled = (state) => {
  webview.canGoBack() ? backClass.remove('disabled') : backClass.add('disabled');
  webview.canGoForward() ? nextClass.remove('disabled') : nextClass.add('disabled');
}

const bindInit = () => {
  if (panelReady) {
    return;
  }
  panelReady = true;
  if (insertCSS) {
    webview.insertCSS(insertCSS);
  }
  maskClass.add('hide');
  // webview.setZoomFactor(1);
  bindClick(nextBtn, () => webview.goForward());
  bindClick(backBtn, () => webview.goBack());
  bindClick(reloadBtn, () => webview.reloadIgnoringCache());
  bindClick(closeBtn, () => win.close());
  bindClick(porBtn, () => invite());
  bindClick(debugBtn, () => {
    console.log(devtoolState);
    if (maskClass.contains('hide')) {
    devtoolState ? webview.closeDevTools() : webview.openDevTools();
    devtoolState = !devtoolState;
  }
});
}

const init = () => {
  webview.setAttribute('preload', preload);
  webview.setAttribute('useragent', userAgent);
  setSize(width, height);
}

const invite = (lnk) => {
  if (lnk) {
    tarIpt.value = lnk;
  }

  if (tarIpt.value) {
    maskClass.remove('hide');
    webview.setAttribute('src', tarIpt.value);
  }
}

init();
invite(target);

webviewBind('devtools-opened', () => { debugClass.add('active'); });
webviewBind('devtools-closed', () => { debugClass.remove('active'); });
webviewBind('did-navigate-in-page', ev => {
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