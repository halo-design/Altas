import { action, observable } from 'mobx';
import { Terminal } from 'xterm';
import { shell } from 'electron';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as os from 'os';
const { spawn } = require('node-pty');
import xtermConfig from '../config/xterm';
import { isMac, isWin } from '../bridge/env';
import * as storage from '../bridge/storage';
import message from 'antd/lib/message';
const debounce = require('lodash/debounce');
import Modal from 'antd/lib/modal';
import { openDeviceDebug } from '../bridge/createWindow';
import { encodeSync, decodeSync } from '../bridge/aes';

const { confirm } = Modal;

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

const xshell = process.env[isWin ? 'COMSPEC' : 'SHELL'];

Terminal.applyAddon(fit);
Terminal.applyAddon(webLinks);

export default class TerminalModel {
  public terminalEl: any = null;
  public terminalParentEl: any = null;
  public term: any = null;
  public ptyProcess: any = null;
  public resizeTerm: any = null;
  public currentExecPath: string = '';
  public encodeUserPassword: string = '';

  @observable public stdoutRunning: boolean = false;
  @observable public adminAuthorizationModalVisible: boolean = false;
  @observable public userPassword: string = '';

  public async init(el: HTMLElement) {
    this.terminalEl = el;
    const parent: any = el.parentNode;
    if (parent && parent.className.toLowerCase().indexOf('terminal') != -1) {
      this.terminalParentEl = parent;
    }

    const localDataProject: any = await storage.readSync(
      'user_default_project_path'
    );

    const { user_default_project_path } = localDataProject;
    this.currentExecPath = user_default_project_path;
    this.initPty(user_default_project_path);
    this.initTerm();

    if (this.term) {
      this.resizeTerm = debounce(() => {
        const { rows, cols } = this.getRowsCols();
        this.term.resize(cols, rows);
      }, 100);

      window.addEventListener('resize', this.resizeTerm, false);
    }

    const localDataShellPassword: any = await storage.readSync(
      'user_shell_password'
    );
    const { user_shell_password } = localDataShellPassword;
    if (user_shell_password) {
      this.encodeUserPassword = user_shell_password;
      const aesPswd: any = await decodeSync(
        user_shell_password,
        'shell_password'
      );

      if (aesPswd) {
        this.userPassword = aesPswd;
      }
    }
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
    } else {
      this.shell('');
      this.clear();
    }
  }

  private initPty(cwd?: string) {
    let curCwd = null;

    if (this.ptyProcess) {
      this.ptyProcess.destroy();
      this.clear();
    }

    if (cwd && cwd.length > 3) {
      curCwd = cwd;
    } else {
      curCwd = process.env.PWD;
    }
    const rowscols = this.getRowsCols();
    const ptyProcess = spawn(xshell, [], {
      name: 'xterm-color',
      cwd: curCwd,
      env: process.env,
      experimentalUseConpty: useConpty,
      conptyInheritCursor: true,
      ...rowscols,
    });

    let clearTimer: any = null;
    ptyProcess.on('data', (data: string) => {
      if (data === 'Password:') {
        this.setAdminAuthorizationModalVisible(true);
      }
      this.stdoutRunning = true;
      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        this.stdoutRunning = false;
        clearTimeout(clearTimer);
      }, 3000);
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
    confirm({
      title: '选择打开方式',
      content: '是否打开应用内置调试工具？',
      okText: '是',
      cancelText: '否',
      onOk() {
        openDeviceDebug(
          {
            target: uri,
            preload: './devTools/dev-tools.js',
          },
          () => {
            message.info('已打开本地调试！');
          }
        );
      },
      onCancel() {
        shell.openExternal(uri);
      },
    });
  }

  public clear() {
    this.term.clear();
  }

  public kill() {
    message.info('当前进程已结束！');
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
  public async adminAuthorization() {
    if (!this.userPassword) {
      message.warn('密码不能为空！');
    } else {
      this.shell(this.userPassword);
      this.setAdminAuthorizationModalVisible(false);
      const aesPswd: any = await encodeSync(
        this.userPassword,
        'shell_password'
      );

      if (aesPswd !== this.encodeUserPassword) {
        storage.write('user_shell_password', {
          user_shell_password: aesPswd,
        });
      }
    }
  }
}
