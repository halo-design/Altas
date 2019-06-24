import * as qs from 'qs';
import { remote } from 'electron';
const win = remote.getCurrentWindow();
import * as hljs from 'highlight.js';
import { getEl, bindClick } from '../public/utils';
import RPC from '../../bridge/rpc';
import { readLocalFileSync, downloadPreviewFile } from '../bridge/global';
const markdownItAttrs = require('markdown-it-attrs');
const options = qs.parse(location.hash.substr(1));
const { remoteUrl } = options;

import '../public/loading.scss';
import './index.scss';

const $content: any = getEl('content');
const $readBtn: any = getEl('readBtn');
const $minBtn: any = getEl('minBtn');
const $toogleBtn: any = getEl('toogleBtn');
const $closeBtn: any = getEl('closeBtn');

const toogleClass = $toogleBtn.classList;

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

RPC.on('ready', () => {
  bindClick($readBtn, () => {
    readLocalFileSync().then(({ content, directory, filepath }: any) => {
      const result = md.render(content);
      $content.innerHTML = result;
      win.maximize();
    });
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

  if (remoteUrl) {
    $content.innerHTML = '<div class="mask" id="mask"></div>';
    downloadPreviewFile(
      remoteUrl,
      ({ content }: any) => {
        const result = md.render(content);
        $content.innerHTML = result;
        win.maximize();
      },
      () => {
        $content.innerHTML = '<h3 class="error-title">文档获取失败！</h3>';
      }
    );
  }

  win.show();
});
