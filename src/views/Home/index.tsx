import * as React from 'react';
import { Terminal } from 'xterm';
import { shell } from 'electron';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as os from 'os';
const { spawn } = require('node-pty');

if (process.platform === 'darwin') {
  process.env.PATH = process.env.PATH + ':/usr/local/bin';
}

const getWindowsBuildNumber = (): number => {
  const osVersion = /(\d+)\.(\d+)\.(\d+)/g.exec(os.release());
  let buildNumber: number = 0;
  if (osVersion && osVersion.length === 4) {
    buildNumber = parseInt(osVersion[3]);
  }
  return buildNumber;
};

const is32ProcessOn64Windows = process.env.hasOwnProperty(
  'PROCESSOR_ARCHITEW6432'
);
const useConpty =
  process.platform === 'win32' &&
  !is32ProcessOn64Windows &&
  getWindowsBuildNumber() >= 18309;

const xshell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];

Terminal.applyAddon(fit);
Terminal.applyAddon(webLinks);

import './index.scss';

const defaultTheme = {
  foreground: '#2c3e50',
  background: '#fff',
  cursor: 'rgba(0, 0, 0, .4)',
  selection: 'rgba(0, 0, 0, 0.3)',
  black: '#000000',
  red: '#e83030',
  brightRed: '#e83030',
  green: '#42b983',
  brightGreen: '#42b983',
  brightYellow: '#ea6e00',
  yellow: '#ea6e00',
  magenta: '#e83030',
  brightMagenta: '#e83030',
  cyan: '#03c2e6',
  brightBlue: '#03c2e6',
  brightCyan: '#03c2e6',
  blue: '#03c2e6',
  white: '#d0d0d0',
  brightBlack: '#808080',
  brightWhite: '#ffffff',
};

const darkTheme = {
  ...defaultTheme,
  foreground: '#fff',
  background: '#1d2935',
  cursor: 'rgba(255, 255, 255, .4)',
  selection: 'rgba(255, 255, 255, 0.3)',
  magenta: '#e83030',
  brightMagenta: '#e83030',
};

class HomeView extends React.Component {
  public terminalEl: any = null;
  public $_terminal: any = null;
  public ptyProcess: any = null;
  public darkMode: boolean = false;

  public componentDidMount() {
    this.initPty();
    this.initTerm();
  }

  public ls() {
    this.ptyProcess.write('ls\n');
  }

  public initPty() {
    const ptyProcess = spawn(xshell, [], {
      name: 'xterm-color',
      cols: 60,
      rows: 32,
      cwd: process.env.PWD,
      env: process.env,
      experimentalUseConpty: useConpty,
      conptyInheritCursor: true,
    });

    ptyProcess.on('data', (data: string) => {
      this.$_terminal.write(data);
    });

    this.ptyProcess = ptyProcess;
  }

  public initTerm() {
    const opts = {
      cols: 80,
      rows: 24,
      fontSize: 12,
      scrollback: 1500,
      fontFamily: 'Monaco, Consolas, Source Code Pro',
      theme: defaultTheme,
    };

    if (this.$_terminal) {
      this.$_terminal.setOption(
        'theme',
        this.darkMode ? darkTheme : defaultTheme
      );
    } else {
      const term = new Terminal(opts);
      this.$_terminal = term;
      term.open(this.terminalEl);
      term.on('blur', () => term.blur);
      term.on('focus', () => term.focus);
      term.on('data', (data: string) => {
        this.ptyProcess.write(data);
      });

      webLinks.webLinksInit(term, this.handleLink);
    }
  }

  public handleLink(event: any, uri: string) {
    shell.openExternal(uri);
  }

  public switchTheme() {
    this.darkMode = !this.darkMode;
    this.initTerm();
  }

  public clear() {
    this.$_terminal.clear();
  }

  public stopSpawn() {
    this.ptyProcess.kill();
  }

  public scrollToBottom() {
    this.$_terminal.scrollToBottom();
  }

  public componentWillUnmount() {
    this.$_terminal.destroy();
    this.ptyProcess.destroy();
  }

  public render() {
    return (
      <div className="page-home">
        <button
          onClick={e => {
            this.clear();
          }}
        >
          清除控制台
        </button>
        <button
          onClick={e => {
            this.ls();
          }}
        >
          执行命令
        </button>
        <button
          onClick={e => {
            this.stopSpawn();
          }}
        >
          结束进程
        </button>
        <button
          onClick={e => {
            this.switchTheme();
          }}
        >
          切换主题
        </button>
        <div
          className="app-terminal"
          ref={node => {
            this.terminalEl = node;
          }}
        />
      </div>
    );
  }
}

export default HomeView;
