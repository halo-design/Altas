const { ipcRenderer, remote } = require('electron');
const win = remote.getCurrentWindow();
const hljs = require('highlight.js');
const markdownItAttrs = require('markdown-it-attrs');
const { getEl, bindClick } = require('../public/utils');
const $content = getEl('content');
const $readBtn = getEl('readBtn');
const $minBtn = getEl('minBtn');
const $toogleBtn = getEl('toogleBtn');
const $closeBtn = getEl('closeBtn');

const toogleClass = $toogleBtn.classList;

bindClick($readBtn, () => {
  ipcRenderer.send('read-local-file');
});

bindClick($minBtn, () => {
  win.minimize();
});

bindClick($closeBtn, () => {
  win.close();
});

bindClick($toogleBtn, () => {
  if (win.isMaximized()) {
    win.unmaximize();
    toogleClass.remove('back');
  } else {
    win.maximize();
    toogleClass.add('back');
  }
})

const md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        throw err;
      }
    }
    return '';
  }
});

md.use(markdownItAttrs, {
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: []
});

ipcRenderer.on('get-local-file-content', (event, { content, directory, filepath }) => {
  const result = md.render(content);
  $content.innerHTML = result;
})

// win.maximize();
win.show();