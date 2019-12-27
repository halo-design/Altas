import { action, observable, computed } from 'mobx';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import xtermConfig from '../../../main/config/xterm';
const debounce = require('lodash/debounce');
const merge = require('lodash/merge');
import { remote } from 'electron';
import message from 'antd/lib/message';
import {
  // sendWsToClient,
  createMockProxyServer,
  disposeMockProxyServer,
  addMockProxyServerListener,
  addMockProxyWsListener,
  addClientWsListener,
  mockProxyWsSendGlobal,
} from '../../../main/bridge/modules/mockProxyServer';
import {
  readMockSync,
  saveMockData,
  resetMockData,
} from '../../../main/bridge/modules/createMocker';

const QRcode = require('qrcode');
const moment = require('moment');
const cardinal = require('cardinal');
const stringifyObject = require('./stringify-object');

const resultFormat = (data: object) =>
  cardinal.highlight(stringifyObject(data, { indent: '  ' }));

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
  @observable public autoSave: boolean = false;
  @observable public mockData: object = {};
  @observable public filterMockData: object = {};

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

    this.getMockData();
  }

  @action
  public delMockDataItemByName(name: string) {
    delete this.mockData[name];
    delete this.filterMockData[name];
  }

  @action
  public addNewMockDataItem(name: string, params: object) {
    this.mockData = {
      ...this.mockData,
      [name]: params,
    };
    this.filterMockData = this.mockData;
  }

  @action
  public mockDataFilterHandle(keyword: string) {
    if (keyword.length === 0) {
      this.filterMockData = this.mockData;
      return;
    }
    const keyList = Object.keys(this.mockData);
    const filterResultKeys = keyList.filter(
      key => key.toLowerCase().indexOf(keyword.toLowerCase()) === 0
    );
    const tempData: any = {};
    filterResultKeys.forEach(key => {
      tempData[key] = this.mockData[key];
    });
    this.filterMockData = tempData;
  }

  @action
  public getMockData() {
    readMockSync().then(({ settings: { autoSave }, data }: any) => {
      this.mockData = data;
      this.filterMockData = data;
      this.autoSave = autoSave;
    });
  }

  @action
  public setMockData(data: object, settings: object) {
    saveMockData(
      {
        data: merge(this.mockData, data),
        settings,
      },
      ({ settings: { autoSave }, data }: any) => {
        this.mockData = data;
        this.filterMockData = data;
        this.autoSave = autoSave;
        message.success('参数配置更新成功！');
      }
    );
  }

  @action
  public resetMockData() {
    resetMockData(({ settings: { autoSave }, data }: any) => {
      this.mockData = data;
      this.filterMockData = data;
      this.autoSave = autoSave;
      message.success('参数配置重置成功！');
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
    if (!status && this.autoSave) {
      this.getMockData();
    }
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

      const fitAddon = new FitAddon();
      const webLinks = new WebLinksAddon((ev: any, uri: string) => {
        remote.shell.openExternal(uri);
      });
      term.loadAddon(webLinks);
      term.loadAddon(fitAddon);

      this.term = term;
      term.open(this.terminalEl);
      term.blur();
      term.focus();
      term.writeln(
        this.getTimeLog() +
          fc.yellow('The proxy server is ready to start.') +
          lnBr
      );

      addClientWsListener(({ fnName, data }: any) => {
        const formatter = (el: string): string => {
          if (el.length > 0) {
            return el.substr(0, 50) + '...';
          } else {
            return '';
          }
        };

        switch (fnName) {
          case 'showOCRIDCard': {
            if (data['IDCardFrontImage']) {
              data.IDCardFrontImage = formatter(data.IDCardFrontImage);
            }
            if (data['IDCardBackImage']) {
              data.IDCardBackImage = formatter(data.IDCardBackImage);
            }
            break;
          }

          case 'showOCRBankCard': {
            if (data['cardImage']) {
              data.cardImage = formatter(data.cardImage);
            }
            break;
          }

          case 'screenShots': {
            if (data['imageResult']) {
              data.imageResult = formatter(data.imageResult);
            }
            break;
          }

          case 'showCameraImagePicker': {
            if (data['imgBase64Data']) {
              data.imgBase64Data = formatter(data.imgBase64Data);
            }
            break;
          }

          case 'downloadPdf': {
            if (data['data']) {
              data.data = formatter(data.data);
            }
            break;
          }
        }

        term.writeln(
          `${this.getTimeLog()}${fc.blue('[Client Recieve]:')} ${resultFormat(
            data
          )}` + lnBr
        );
      });

      mockProxyWsSendGlobal(({ data }: any) => {
        if (data['fnName']) {
          term.writeln(
            `${this.getTimeLog()}${fc.cyan('[Proxy Handle]:')} ${fc.purple(
              data['fnName']
            )}`
          );
          term.writeln(
            `${this.getTimeLog()}${fc.cyan('[Proxy Params]:')} ${resultFormat(
              data['params']
            )}` + lnBr
          );
        } else {
          term.writeln(
            `${this.getTimeLog()}${fc.purple('[Server Send]:')} ${resultFormat(
              data
            )}`
          );
        }
      });
    }
  }
}
