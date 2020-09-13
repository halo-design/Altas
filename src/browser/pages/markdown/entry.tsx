import * as qs from 'qs';
import * as path from 'path';
import { remote } from 'electron';
const win = remote.getCurrentWindow();
import * as hljs from 'highlight.js';
import { getEl, bindClick } from '../public/utils';
import RPC from '../../main/bridge/rpc';
import { setSaveAs } from '../../main/bridge/modules/file';
import CreateContextMenu from '../../main/bridge/modules/CreateContextMenu';
import {
  readLocalFileSync,
  downloadPreviewFile,
  mdSaveAsHtml,
} from '../../main/bridge/modules/markdown';
import { url } from '../../main/constants/Reg';
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
const $fileName: any = getEl('fileName');

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

const toogleFn = () => {
  if (win.isMaximized()) {
    win.unmaximize();
    toogleClass.remove('back');
  } else {
    win.maximize();
    toogleClass.add('back');
  }
};

const renderDoc = (filepath: string, content: string) => {
  const fileName = path.basename(filepath);
  const fileNameWithoutSuffix = fileName.replace('.md', '');
  const outputHtmlFileName = fileName.replace(/\.md/, '.html');

  $fileName.innerHTML = fileName;
  const result = md.render(content);
  $content.innerHTML = result;
  win.maximize();
  toogleClass.add('back');

  new CreateContextMenu($content, [
    {
      click: () => {
        setSaveAs(outputHtmlFileName, (path: string) => {
          mdSaveAsHtml(
            fileNameWithoutSuffix,
            result,
            path,
            (optputDir: string) => {
              remote.shell.showItemInFolder(optputDir);
            }
          );
        });
      },
      label: '导出到HTML',
    },
  ]);
};

RPC.on('ready', () => {
  bindClick($readBtn, () => {
    readLocalFileSync().then(({ content, directory, filepath }: any) => {
      renderDoc(filepath, content);
    });
  });

  bindClick($closeBtn, () => {
    win.close();
  });

  bindClick($minBtn, () => {
    win.minimize();
  });

  bindClick($toogleBtn, toogleFn);

  if (remoteUrl) {
    $content.innerHTML = '<div class="mask" id="mask"></div>';
    downloadPreviewFile(
      remoteUrl,
      ({ content }: any) => {
        renderDoc(remoteUrl, content);
      },
      () => {
        $content.innerHTML = '<h3 class="error-title">文档获取失败！</h3>';
      }
    );
  }

  document.addEventListener('click', (e: any) => {
    const tar = e.target;
    if (tar.tagName.toLowerCase() === 'a') {
      const isLink = url.test(tar.href);
      if (isLink) {
        remote.shell.openExternal(tar.href);
        e.stopPropagation();
        e.preventDefault();
      }
    }
  });
});
