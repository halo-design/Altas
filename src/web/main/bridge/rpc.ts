import * as electron from 'electron';
const EventEmitter = require('events');

export class Client {
  public emitter = new EventEmitter();
  public ipc = electron.ipcRenderer;
  public id: string | null = null;

  constructor() {
    this.ipcListener = this.ipcListener.bind(this);
    this.dispatch = this.dispatch.bind(this);
    this.on = this.on.bind(this);
    this.once = this.once.bind(this);
    this.removeListener = this.removeListener.bind(this);
    this.removeAllListeners = this.removeAllListeners.bind(this);
    this.destroy = this.destroy.bind(this);

    if ('__rpcId' in window) {
      setTimeout(() => {
        this.id = window['__rpcId'];
        this.id && this.ipc.on(this.id, this.ipcListener);
        this.emitter.emit('ready');
      }, 0);
    } else {
      this.ipc.on('init', (ev: any, uid: string) => {
        window['__rpcId'] = uid;
        this.id = uid;
        this.ipc.on(uid, this.ipcListener);
        this.emitter.emit('ready');
      });
    }
  }

  private ipcListener(event: any, { ch, data }: { ch: any; data: any }) {
    this.emitter.emit(ch, data);
  }

  public wsRecieveGlobal(callback: Function) {
    this.ipc.on('mock-proxy-ws-recieve-global', (ev: any, args: any) => {
      callback(args);
    });
  }

  public wsBrodcastGlobal(args: any) {
    this.ipc.send('mock-proxy-ws-send-global', args);
  }

  public on(ev: any, fn: any) {
    this.emitter.on(ev, fn);
  }

  public once(ev: any, fn: any) {
    this.emitter.once(ev, fn);
  }

  public dispatch(ev: any, data: any) {
    if (!this.id) {
      throw new Error('Not ready');
    }
    this.ipc.send(this.id, { ev, data });
  }

  public removeListener(ev: any, fn: any) {
    this.emitter.removeListener(ev, fn);
  }

  public removeAllListeners() {
    this.emitter.removeAllListeners();
  }

  public destroy() {
    this.removeAllListeners();
    this.ipc.removeAllListeners('');
  }
}

export default new Client();
