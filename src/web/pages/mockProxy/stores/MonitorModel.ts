import { action, observable } from 'mobx';
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

export default class TerminalModel {
  @observable public serverOnline: boolean = false;
  @observable public websocketOnline: boolean = false;
  @observable public host: string = '';
  public terminalEl: any = null;
  public term: any = null;
  public resizeTerm: any = null;
  public port: number = 8282;

  constructor() {
    addMockProxyServerListener((status: any, args: any) => {
      this.setServerOnline(status);
      const { ip, port } = args;
      this.setHost(ip, port);
      this.term.writeln(fc.green('Proxy server started successfully!') + lnBr);
      console.log('server:', status, args);
    });

    addMockProxyWsListener((status: any, args: any) => {
      this.setWebsocketOnline(status);
      console.log('ws:', status, args);
    });
  }

  public createServer(port?: number) {
    this.term.writeln(fc.blue('Starting the proxy server...'));
    createMockProxyServer(port || this.port);
  }

  public disposeServer() {
    disposeMockProxyServer();
  }

  @action
  public setHost(ip: string, port: number) {
    if (ip) {
      this.host = `http://${ip}:${port}`;
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
      term.writeln(fc.yellow('The proxy server is ready to start.') + lnBr);

      addClientWsListener((args: any) => {
        term.writeln(`ws recieve: ${resultFormat(args.data)}`);
      });

      mockProxyWsSendGlobal((args: any) => {
        term.writeln(`ws send: ${resultFormat(args.data)}`);
      });

      webLinks.webLinksInit(term, (ev: any, uri: string) => {
        remote.shell.openExternal(uri);
      });
    }
  }
}
