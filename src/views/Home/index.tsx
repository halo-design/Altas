import * as React from 'react';
import { Terminal } from 'xterm';
import { shell } from 'electron';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as os from 'os';
const { spawn } = require('node-pty');
import xtermConfig from '../../utils/xTermConfig';

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
const rowscols = {
  cols: 80,
  rows: 34,
};

Terminal.applyAddon(fit);
Terminal.applyAddon(webLinks);

import './index.scss';

class HomeView extends React.Component {
  public terminalEl: any = null;
  public term: any = null;
  public ptyProcess: any = null;

  public componentDidMount() {
    this.initPty();
    this.initTerm();
  }

  public ls() {
    if (this.ptyProcess) {
      if (!this.ptyProcess._writable) {
        this.initPty();
      }
      this.ptyProcess.write('ls\n');
    }
  }

  public initPty() {
    if (this.ptyProcess) {
      this.ptyProcess.kill();
      this.ptyProcess.destroy();
    }
    const ptyProcess = spawn(xshell, [], {
      name: 'xterm-color',
      cwd: process.env.PWD,
      env: process.env,
      experimentalUseConpty: useConpty,
      conptyInheritCursor: true,
      ...rowscols,
    });

    ptyProcess.on('data', (data: string) => {
      this.term.write(data);
    });

    this.ptyProcess = ptyProcess;
  }

  public initTerm() {
    if (!this.term) {
      const term = new Terminal(
        xtermConfig({
          ...rowscols,
        })
      );
      this.term = term;
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

  public clear() {
    this.term.clear();
  }

  public stopSpawn() {
    this.ptyProcess.kill();
  }

  public scrollToBottom() {
    this.term.scrollToBottom();
  }

  public componentWillUnmount() {
    this.term.destroy();
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
