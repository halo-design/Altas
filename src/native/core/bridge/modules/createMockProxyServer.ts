import * as fs from 'fs';
import * as path from 'path';
import log from 'electron-log';
import * as http from 'http';
import { ipcMain, nativeImage } from 'electron';
const WebSocket = require('faye-websocket');
import file from '../../../utils/file';
import { sendToAllWindows } from '../../../utils/winManage';
import mime from '../../../constants/mime';
import { appDataFullPath } from '../../../constants/app';
import { saveFile } from '../../../utils/file';
import * as uuid from 'uuid';
import * as url from 'url';
import * as ip from 'ip';
import {
  readCustomMockDataSync,
  writeCustomMockData,
} from '../../../utils/mocker';

const savebase64Image = (url: string) => {
  const img = nativeImage.createFromDataURL(url);
  const buf = img.toPNG();
  const savePath = path.join(appDataFullPath, uuid.v4() + '.png');
  saveFile(savePath, buf);
  return savePath;
};

const validSave = (source: any, key: string) => {
  if (source[key]) {
    const savePath = savebase64Image(source[key]);
    log.info(savePath);
    source[key] = url.format({
      pathname: savePath,
      protocol: 'file:',
      slashes: true,
    });
  }
};

export default (RPC: any) => {
  let wsGlobal: any = null;
  let localMockData: any = {};

  const wsSender = (event: any, args: any) => {
    if (wsGlobal) {
      RPC.dispatch('mock-proxy-ws-send-global', args);
      wsGlobal.send(
        JSON.stringify({
          ...args,
          resCode: 201,
        })
      );
    }
  };

  RPC.on('create-mock-proxy-server', async ({ port }: any) => {
    ipcMain.on('mock-proxy-ws-send-global', wsSender);

    localMockData = await readCustomMockDataSync();
    const isAutoSave = localMockData.settings.autoSave;

    let usePort: number = port;
    const getHost = () => ({
      port: usePort,
      ip: ip.address(),
    });

    let server: any = http.createServer(({ url }: any, res) => {
      if (url === '/') {
        const page = fs.readFileSync(
          file.path('renderer/public/html/takeover.html'),
          'utf8'
        );
        res.setHeader('Content-Type', mime.html);
        res.write(page);
      } else if (url === '/favicon.ico') {
        const favicon = fs.readFileSync(file.path('renderer/favicon.ico'));
        res.setHeader('Content-Type', mime.ico);
        res.write(favicon);
      } else if (url.indexOf('/static/') === 0) {
        const filePath = file.path(url.replace('/static/', 'renderer/public/'));
        let ext = path.extname(url);
        ext = ext ? ext.slice(1) : 'unknown';
        const contentType = mime[ext] || 'text/plain';
        res.setHeader('Content-Type', contentType);

        const img = fs.readFileSync(filePath);
        res.write(img);
      }
      res.end();
    });

    server.on('upgrade', (request: any, socket: any, body: any) => {
      const ws = new WebSocket(request, socket, body);
      wsGlobal = ws;

      sendToAllWindows('mock-proxy-ws-connect-global', getHost());

      RPC.dispatch('mock-proxy-ws-connect', getHost());

      ws.on('message', ({ data }: any) => {
        log.info('Recieve:', data);
        const formatData = JSON.parse(data);
        const { fnName, resCode } = formatData;

        if (resCode === 200) {
          wsSender(null, {
            resCode: 200,
            data: 'Server Connected.',
          });
        }

        if (resCode === 201 && isAutoSave) {
          const originData = {
            ...formatData.data,
          };

          switch (fnName) {
            case 'showOCRIDCard': {
              validSave(originData, 'IDCardFrontImage');
              validSave(originData, 'IDCardBackImage');
              break;
            }

            case 'showOCRBankCard': {
              validSave(originData, 'cardImage');
              break;
            }

            case 'screenShots': {
              validSave(originData, 'imageResult');
              break;
            }

            case 'showCameraImagePicker': {
              validSave(originData, 'imgBase64Data');
              break;
            }

            case 'downloadPdf': {
              originData['data'] = '';
              break;
            }
          }

          localMockData.data[fnName] = originData;
          formatData.data = originData;
        }

        sendToAllWindows('mock-proxy-ws-recieve-global', formatData);
      });

      ws.on('close', (event: any) => {
        log.info('Websocket close:', event.code, event.reason);

        sendToAllWindows('mock-proxy-ws-disconnected-global', getHost());

        RPC.dispatch('mock-proxy-ws-disconnected', getHost());
      });
    });

    server.on('close', () => {
      wsGlobal = null;
      ipcMain.removeListener('mock-proxy-ws-send-global', wsSender);
      writeCustomMockData(localMockData);
      log.info('Server close:', usePort);
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
      log.info('Server listening:', usePort);

      sendToAllWindows('mock-proxy-server-connect-global', getHost());

      RPC.dispatch('mock-proxy-server-connect', getHost());
    });

    RPC.on('dispose-mock-proxy-server', () => {
      if (wsGlobal) {
        wsGlobal.close();
      }
      if (server) {
        server.close();
      }

      sendToAllWindows('mock-proxy-server-disconnected-global', getHost());

      RPC.dispatch('mock-proxy-server-disconnected', getHost());
      server = null;
      wsGlobal = null;
    });
  });
};
