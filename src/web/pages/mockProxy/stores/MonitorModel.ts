import { action, observable, computed } from 'mobx';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import xtermConfig from '../../../main/config/xterm';
const debounce = require('lodash/debounce');
import { remote } from 'electron';
import {
  // sendWsToClient,
  createMockProxyServer,
  disposeMockProxyServer,
  addMockProxyServerListener,
  addMockProxyWsListener,
  addClientWsListener,
  mockProxyWsSendGlobal,
} from '../../../main/bridge/mockProxyServer';
const QRcode = require('qrcode');
const moment = require('moment');

Terminal.applyAddon(fit);
Terminal.applyAddon(webLinks);

const resultFormat = (data: object) => JSON.stringify(data);

const lnBr = process.platform === 'win32' ? '\r\n' : '\n';

const fc: any = {
  red: (str: string) => `\x1B[1;0;31m${str}\x1B[0m`,
  green: (str: string) => `\x1B[1;0;32m${str}\x1B[0m`,
  yellow: (str: string) => `\x1B[1;0;33m${str}\x1B[0m`,
  blue: (str: string) => `\x1B[1;0;34m${str}\x1B[0m`,
  purple: (str: string) => `\x1B[1;0;35m${str}\x1B[0m`,
  cyan: (str: string) => `\x1B[1;0;36m${str}\x1B[0m`,
  white: (str: string) => `\x1B[1;0;37m${str}\x1B[0m`,
};

export default class MonitorlModel {
  @observable public serverOnline: boolean = false;
  @observable public websocketOnline: boolean = false;
  @observable public qrCanvas: any = null;
  @observable public host: string = '';
  @observable public terminalEl: any = null;
  @observable public term: any = null;
  @observable public resizeTerm: any = null;
  @observable public port: number = 2323;
  @observable public mockerVisible: boolean = false;

  @computed get qrCodeVisible() {
    return this.serverOnline && !this.websocketOnline && this.host.length > 0;
  }

  constructor() {
    addMockProxyServerListener((status: any, args: any) => {
      this.setServerOnline(status);
      const { ip, port } = args;

      if (status) {
        this.setHost(ip, port);
      }

      this.term.writeln(
        this.getTimeLog() +
          fc.green(
            `Proxy server ${status ? 'started' : 'closed'} successfully!`
          ) +
          lnBr
      );

      if (!status) {
        this.term.writeln(
          this.getTimeLog() +
            fc.yellow('The proxy server is ready to restart.') +
            lnBr
        );
      }
    });

    addMockProxyWsListener((status: any, args: any) => {
      this.setWebsocketOnline(status);
    });
  }

  @action
  public setMockerVisible(state: boolean) {
    this.mockerVisible = state;
  }

  @action
  public createServer(port?: number) {
    this.term.writeln(
      this.getTimeLog() + fc.blue('Starting the proxy server...') + lnBr
    );
    createMockProxyServer(port || this.port);
  }

  public disposeServer() {
    disposeMockProxyServer();
  }

  @action
  public initQrcode(el: any) {
    this.qrCanvas = el;
  }

  @action
  public setHost(ip: string, port: number) {
    if (ip) {
      this.host = `http://${ip}:${port}`;

      console.log(111111, this.qrCodeVisible, this.qrCanvas);
      if (this.qrCanvas && this.qrCodeVisible) {
        QRcode.toCanvas(this.qrCanvas, this.host, {
          width: 240,
          margin: 0,
        });
      }
    }
  }

  @action
  public setServerOnline(status: boolean) {
    this.serverOnline = status;
  }

  @action
  public setWebsocketOnline(status: boolean) {
    this.websocketOnline = status;
  }

  @action
  public initMonitor(el: any) {
    this.terminalEl = el;

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

  public getTimeLog() {
    return fc.yellow(`${moment().format('h:mm:ss.SSS')} › `);
  }

  public clearLog() {
    if (this.term) {
      this.term.clear();
    }
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
      term.writeln(
        this.getTimeLog() +
          fc.yellow('The proxy server is ready to start.') +
          lnBr
      );

      addClientWsListener(({ data }: any) => {
        term.writeln(
          `${this.getTimeLog()}${fc.green('[CLIENT RECIEVE]:')} ${resultFormat(
            data
          )}` + lnBr
        );
      });

      mockProxyWsSendGlobal(({ data }: any) => {
        if ('fnName' in data) {
          term.writeln(
            `${this.getTimeLog()}${fc.blue('[PROXY HANDLE]:')} ${fc.purple(
              data['fnName']
            )}`
          );
          term.writeln(
            `${this.getTimeLog()}${fc.blue('[PROXY PARAMS]:')} ${resultFormat(
              data['params']
            )}` + lnBr
          );
        } else {
          term.writeln(
            `${this.getTimeLog()}${fc.purple('[SERVER SEND]:')} ${resultFormat(
              data
            )}`
          );
        }
      });

      webLinks.webLinksInit(term, (ev: any, uri: string) => {
        remote.shell.openExternal(uri);
      });
    }
  }
}