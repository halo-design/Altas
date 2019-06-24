import * as qs from 'qs';
const { ipcRenderer, remote } = require('electron');
const win = remote.getCurrentWindow();
const hljs = require('highlight.js');
const markdownItAttrs = require('markdown-it-attrs');
const { getEl, bindClick } = require('../public/utils');
const options = qs.parse(location.hash.substr(1));
const { remoteUrl } = options;

import '../public/loading.scss';
import './index.scss';

const $content = getEl('content');
const $readBtn = getEl('readBtn');
const $minBtn = getEl('minBtn');
const $toogleBtn = getEl('toogleBtn');
const $closeBtn = getEl('closeBtn');

const toogleClass = $toogleBtn.classList;

bindClick($readBtn, () => {
  ipcRenderer.send('read-local-file');
});

bindClick($closeBtn, () => {
  win.close();
});

bindClick($minBtn, () => {
  win.minimize();
});

bindClick($toogleBtn, () => {
  if (win.isMaximized()) {
    win.unmaximize();
    toogleClass.remove('back');
  } else {
    win.maximize();
    toogleClass.add('back');
  }
});

const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        throw err;
      }
    }
    return '';
  },
});

md.use(markdownItAttrs, {
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: [],
});

if (remoteUrl) {
  $content.innerHTML = '<div class="mask" id="mask"></div>';
  ipcRenderer.send('download-preview-file', { url: remoteUrl });
  ipcRenderer.once(
    'download-preview-file-result',
    (event: any, { content, result }: any) => {
      if (result === 'completed') {
        const result = md.render(content);
        $content.innerHTML = result;
      } else {
        $content.innerHTML = '<h3 class="error-title">文档获取失败！</h3>';
      }
    }
  );

  win.on('closed', () => {
    ipcRenderer.send('download-preview-file-cancel');
  });

  win.maximize();
} else {
  ipcRenderer.once(
    'get-local-file-content',
    (event: any, { content, directory, filepath }: any) => {
      const result = md.render(content);
      $content.innerHTML = result;
    }
  );
}
win.show();
