import * as React from 'react';
import { Terminal } from 'xterm';
import { shell } from 'electron';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as os from 'os';
const { spawn } = require('node-pty');
import xtermConfig from '../../utils/xTermConfig';
const debounce = require('lodash/debounce');

import './index.scss';

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

class TerminalView extends React.Component<any, any> {
  public terminalEl: any = null;
  public term: any = null;
  public ptyProcess: any = null;
  public resizeTerm: any = null;

  public componentDidMount() {
    this.initPty();
    this.initTerm();

    if (this.term) {
      this.resizeTerm = debounce(() => {
        const { rows, cols } = this.getRowsCols();
        this.term.resize(cols, rows);
      }, 100);

      window.addEventListener('resize', this.resizeTerm, false);
    }
  }

  public getRowsCols() {
    if (this.terminalEl) {
      const { offsetHeight, offsetWidth } = this.terminalEl;
      return {
        rows: ~~(offsetHeight / 16),
        cols: ~~(offsetWidth / 7),
      };
    } else {
      return {
        cols: 69,
        rows: 35,
      };
    }
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
    const rowscols = this.getRowsCols();
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
      const rowscols = this.getRowsCols();
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
    window.removeEventListener('resize', this.resizeTerm);
  }

  public render() {
    return (
      <div className="app-terminal">
        <div className="panel">
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
        </div>
        <div
          className="terminal"
          ref={node => {
            this.terminalEl = node;
          }}
        />
      </div>
    );
  }
}

export default TerminalView;
