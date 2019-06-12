import { action, observable } from 'mobx';
import { Terminal } from 'xterm';
import { shell } from 'electron';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as os from 'os';
const { spawn } = require('node-pty');
import xtermConfig from '../utils/xtermConfig';
import { isMac, isWin } from '../utils/env';
import * as storage from '../utils/storage';
import message from 'antd/lib/message';
const debounce = require('lodash/debounce');

if (isMac) {
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
  isWin && !is32ProcessOn64Windows && getWindowsBuildNumber() >= 18309;

const xshell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];

Terminal.applyAddon(fit);
Terminal.applyAddon(webLinks);

export default class TerminalModel {
  public terminalEl: any = null;
  public terminalParentEl: any = null;
  public term: any = null;
  public ptyProcess: any = null;
  public resizeTerm: any = null;
  public currentExecPath: string = '';

  @observable public adminAuthorizationModalVisible: boolean = false;
  @observable public userPassword: string = '';

  public init(el: HTMLElement) {
    this.terminalEl = el;
    const parent: any = el.parentNode;
    if (parent && parent.className.toLowerCase().indexOf('terminal') != -1) {
      this.terminalParentEl = parent;
    }

    storage.read('user_default_project_path', (data: any) => {
      const { user_default_project_path } = data;
      this.initPty(user_default_project_path);
      this.initTerm();

      if (this.term) {
        this.resizeTerm = debounce(() => {
          const { rows, cols } = this.getRowsCols();
          this.term.resize(cols, rows);
        }, 100);

        window.addEventListener('resize', this.resizeTerm, false);
      }
    });
  }

  public show() {
    if (this.terminalParentEl) {
      this.terminalParentEl.classList.remove('hide');
    }
  }

  public hide() {
    if (this.terminalParentEl) {
      this.terminalParentEl.classList.add('hide');
    }
  }

  private getRowsCols() {
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

  public shell(command: string) {
    if (this.ptyProcess) {
      const extra = isWin ? '\r ' : '';
      this.ptyProcess.write(command + extra + '\n');
    }
  }

  public setExecPath(dir: string, force: boolean) {
    if (dir !== this.currentExecPath || force) {
      this.initPty(dir);
      this.currentExecPath = dir;
    }
  }

  private initPty(cwd?: string) {
    if (this.ptyProcess) {
      this.clear();
      this.ptyProcess.destroy();
    }
    const rowscols = this.getRowsCols();
    const ptyProcess = spawn(xshell, [], {
      name: 'xterm-color',
      cwd: cwd || process.env.PWD,
      env: process.env,
      experimentalUseConpty: useConpty,
      conptyInheritCursor: true,
      ...rowscols,
    });

    ptyProcess.on('data', (data: string) => {
      if (data === 'Password:') {
        this.setAdminAuthorizationModalVisible(true);
      }
      this.term.write(data);
    });

    this.ptyProcess = ptyProcess;
  }

  private initTerm() {
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

  private handleLink(event: any, uri: string) {
    shell.openExternal(uri);
  }

  public clear() {
    this.term.clear();
  }

  public kill() {
    this.clear();
    this.initPty(this.currentExecPath);
  }

  public scrollToBottom() {
    this.term.scrollToBottom();
  }

  public destroy() {
    this.clear();
    this.term.destroy();
    this.ptyProcess.destroy();
    window.removeEventListener('resize', this.resizeTerm);
  }

  @action
  public setAdminAuthorizationModalVisible(state: boolean) {
    this.adminAuthorizationModalVisible = state;
  }

  @action
  public handleChangeUserPassword(val: string) {
    this.userPassword = val;
  }

  @action
  public adminAuthorization() {
    if (!this.userPassword) {
      message.warn('密码不能为空！');
    } else {
      this.shell(this.userPassword);
      this.setAdminAuthorizationModalVisible(false);
    }
  }
}
