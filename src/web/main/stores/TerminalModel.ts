import { action, observable, computed } from 'mobx';
import { Terminal } from 'xterm';
import { openLink, getProcessPid, getWindow } from '../bridge/system';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import * as os from 'os';
import { Howl } from 'howler';
const { spawn } = require('node-pty');
import xtermConfig from '../config/xterm';
import { isMac, isWin } from '../bridge/modules/env';
import { dataReadSync, dataWrite } from '../utils/dataManage';
import message from 'antd/lib/message';
const debounce = require('lodash/debounce');
import Modal from 'antd/lib/modal';
import {
  deviceSimulator,
  cheetahSimulator,
} from '../bridge/modules/createWindow';
import { encodeSync, decodeSync } from '../bridge/modules/aes';
import { allDeviceObject } from '../config/DeviceDescriptors';

const heroBgMusic = new Howl({
  src: ['public/audio/viva_la_vida.mp3'],
  volume: 0.8,
});

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

export default class TerminalModel {
  public terminalEl: any = null;
  public terminalParentEl: any = null;
  public term: any = null;
  public ptyProcess: any = null;
  public resizeTerm: any = null;
  public currentExecPath: string = '';
  public encodeUserPassword: string = '';
  public bgMusicPlay: boolean = false;

  @observable public stdoutRunning: boolean = false;
  @observable public adminAuthorizationModalVisible: boolean = false;
  @observable public userPassword: string = '';
  @observable public useDebugDevice: string = 'iPhone 8';
  @observable public useDebugSimulator: string = 'deviceSimulator';
  @observable public customUAState: boolean = false;
  @observable public customUAString: string = '';

  constructor() {
    this.setUseDebugDevice = this.setUseDebugDevice.bind(this);
    this.handleLink = this.handleLink.bind(this);
  }

  @computed get deviceConfig() {
    let config = allDeviceObject[this.useDebugDevice];
    if (this.customUAState && this.customUAString.length > 0) {
      config = {
        ...config,
        userAgent: this.customUAString,
      };
    }
    return config;
  }

  public async init(el: HTMLElement) {
    this.terminalEl = el;
    const parent: any = el.parentNode;
    if (parent && parent.className.toLowerCase().indexOf('terminal') != -1) {
      this.terminalParentEl = parent;
    }

    const localDataProject: any = await dataReadSync(
      'user_default_project_path'
    );

    if (localDataProject) {
      this.currentExecPath = localDataProject;
    }

    this.initPty(this.currentExecPath);
    this.initTerm();

    if (this.term) {
      this.resizeTerm = debounce(() => {
        const { rows, cols } = this.getRowsCols();
        this.term.resize(cols, rows);
      }, 100);

      window.addEventListener('resize', this.resizeTerm, false);
    }

    const localDataShellPassword: any = await dataReadSync(
      'user_shell_password'
    );
    if (localDataShellPassword) {
      this.encodeUserPassword = localDataShellPassword;
      const aesPswd: any = await decodeSync(
        localDataShellPassword,
        'shell_password'
      );

      if (aesPswd) {
        this.userPassword = aesPswd;
      }
    }

    const devToolsDebugDevice: any = await dataReadSync(
      'devtools_debug_device'
    );

    if (devToolsDebugDevice) {
      this.useDebugDevice = devToolsDebugDevice;
    }

    const customUAState: any = await dataReadSync('custom_useragent_state');

    if (customUAState) {
      this.customUAState = customUAState;
    }

    const customUAString: any = await dataReadSync('custom_useragent_string');

    if (customUAString) {
      this.customUAString = customUAString;
    }

    const devToolsDebugSimulator: any = await dataReadSync(
      'devtools_debug_simulator'
    );

    if (devToolsDebugSimulator) {
      this.useDebugSimulator = devToolsDebugSimulator;
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
      this.clearTerm();
    }
  }

  private initPty(cwd?: string, cb?: Function) {
    let curCwd = null;

    if (this.ptyProcess) {
      this.clearTerm();
      this.ptyProcess.destroy();
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
      if (data.trim() === 'Password:') {
        this.setAdminAuthorizationModalVisible(true);
      }

      if (data.trim().indexOf('hello altas') === 0) {
        getWindow().webContents.toggleDevTools();
      }

      if (data.trim().indexOf('viva la vida') === 0) {
        this.bgMusicPlay = !this.bgMusicPlay;
        this.bgMusicPlay ? heroBgMusic.play() : heroBgMusic.stop();
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
    cb && cb();
  }

  private initTerm() {
    if (!this.term) {
      const rowscols = this.getRowsCols();
      const term = new Terminal(
        xtermConfig({
          ...rowscols,
        })
      );
      const fitAddon = new FitAddon();
      const webLinks = new WebLinksAddon(this.handleLink);
      term.loadAddon(webLinks);
      term.loadAddon(fitAddon);
      this.term = term;

      term.open(this.terminalEl);
      fitAddon.fit();

      term.blur();
      term.focus();
      term.onData((data: string) => {
        this.ptyProcess.write(data);
      });
    }
  }

  @action
  public setUseDebugDevice(type: string) {
    this.useDebugDevice = type;
    dataWrite('devtools_debug_device', type);
  }

  @action
  public setUseDebugSimulator(type: string) {
    this.useDebugSimulator = type;
    dataWrite('devtools_debug_simulator', type);
  }

  private handleLink(event: any, uri: string) {
    confirm({
      title: '选择打开方式',
      content: '是否打开应用内置调试工具？',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        if (this.useDebugSimulator == 'deviceSimulator') {
          deviceSimulator(
            {
              target: uri,
              descriptors: this.deviceConfig,
            },
            () => {
              message.info('已打开Web应用调试器！');
            }
          );
        } else if (this.useDebugSimulator == 'cheetahSimulator') {
          cheetahSimulator(
            {
              target: uri,
              preload: './public/scripts/devtools-inject.js',
              descriptors: this.deviceConfig,
            },
            () => {
              message.info('已打开猎豹App调试器！');
            }
          );
        }
      },
      onCancel: () => {
        openLink(uri);
      },
    });
  }

  public clearTerm() {
    this.shell(isWin ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    this.term.clear();
  }

  public kill() {
    message.info('当前进程已结束！');
    this.initPty(this.currentExecPath, () => {
      if (isMac) {
        getProcessPid(this.currentExecPath, ({ pidList }: any) => {
          pidList.forEach((num: string) => {
            this.shell(`sudo kill -9 ${num}`);
          });
        });
      }
    });
  }

  public scrollToBottom() {
    this.term.scrollToBottom();
  }

  public destroy() {
    this.clearTerm();
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
  public setCunstomUAState(state: boolean) {
    this.customUAState = state;
    dataWrite('custom_useragent_state', state);
  }

  @action
  public setCunstomUAString(type: string) {
    this.customUAString = type;
    dataWrite('custom_useragent_string', type);
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
        dataWrite('user_shell_password', aesPswd);
      }
    }
  }
}
