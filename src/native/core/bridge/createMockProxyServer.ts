import * as fs from 'fs';
import log from 'electron-log';
import * as http from 'http';
import { ipcMain } from 'electron';
const WebSocket = require('faye-websocket');
import file from '../../utils/file';
import { BrowserWindow } from 'electron';

export default (RPC: any) => {
  let wsGlobal: any = null;

  ipcMain.on('mock-proxy-ws-send-global', (event: any, args: any) => {
    if (wsGlobal) {
      wsGlobal.send(JSON.stringify(args));
    }
  });

  RPC.on('create-mock-proxy-server', (args: any) => {
    const { port } = args;

    let usePort: number = port;
    const server = http.createServer((req: any, res) => {
      const page = fs.readFileSync(file.path('resources/waiter.html'), 'utf8');
      res.write(page);
      res.end();
    });

    server.on('upgrade', (request: any, socket: any, body: any) => {
      const ws = new WebSocket(request, socket, body);
      wsGlobal = ws;

      RPC.dispatch('mock-proxy-ws-connect', { usePort });
      ws.on('message', (event: any) => {
        log.info('Recieve:', event.data);
        const allBrowserWindows = BrowserWindow.getAllWindows();
        allBrowserWindows.forEach((win: Electron.BrowserWindow) => {
          win.webContents.send(
            'mock-proxy-ws-recieve-global',
            JSON.parse(event.data)
          );
        });
      });

      ws.on('close', (event: any) => {
        log.info('close', event.code, event.reason);
        RPC.dispatch('mock-proxy-ws-disconnected', { usePort });
      });
    });

    server.on('close', () => {
      wsGlobal = null;
      RPC.dispatch('mock-proxy-server-disconnected', { port: usePort });
    });

    server.on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        log.info('Port is already in use.');
        setTimeout(() => {
          usePort++;
          server.close();
          server.listen(usePort);
        }, 1000);
      } else {
        log.error(e.toString());
        server.close();
        wsGlobal = null;
      }
    });

    server.listen(port, () => {
      log.info(usePort);
      RPC.dispatch('mock-proxy-server-connect', { port: usePort });
    });
  });
};
