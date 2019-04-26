import * as electron from "electron";
import { showBetterMessageBox } from "electron-better-dialog";
import DL from "electron-dl";
import * as storage from "electron-json-storage";
import * as ip from "ip";
import * as md5 from "md5";
import * as os from "os";
// const notifier from 'node-notifier')
const { ipcMain, clipboard } = electron;
import log from "electron-log";

import * as crypto from "./crypto";
import file from "./file";
import readTxtByLine from "./readTxtByLine";

export default (mainWindow: any, info: object) => {
  // 获取app绝对目录
  ipcMain.on("get-appdir", (event: electron.Event) => {
    event.sender.send("appdir", file.root);
  });

  // 数据写入
  ipcMain.on(
    "write-storage",
    (event: electron.Event, key: string, data: object) => {
      storage.set(key, data, err => {
        if (err) {
          throw err;
        } else {
          log.info(data);
          log.info(`[${key}]：数据已写入`);
        }
      });
    }
  );

  // 数据读取
  ipcMain.on("read-storage", (event: electron.Event, key: string) => {
    storage.get(key, (err, data) => {
      event.sender.send("get-storage", data);
    });
  });

  // 数据删除
  ipcMain.on("remove-storage", (event: electron.Event, key: string) => {
    storage.remove(key, err => {
      log.error(err);
    });
    log.info(`[${key}]：数据已删除`);
  });

  // 监听应用弹窗
  ipcMain.on("on-dialog-message", (event: electron.Event, args: any) => {
    showBetterMessageBox(mainWindow, args);
  });

  // 应用启动监听
  ipcMain.on("ipc-start", (event: electron.Event) => {
    event.sender.send("ipc-running", info);
  });

  // 按行读取本地文件
  ipcMain.on("read-text", (event: electron.Event, args: string) => {
    readTxtByLine(
      args,
      (index, line) => {
        const params = { index, line, status: "pending" };
        event.sender.send("get-text-line", params);
      },
      () => {
        event.sender.send("get-text-line", { status: "done" });
      }
    );
  });

  // 文件下载监听
  let dlItem: any;
  ipcMain.on(
    "file-download",
    (event: electron.Event, url: string, args: any) => {
      let timer: any;

      const createTimer = () => {
        const { timeout } = args;
        if (timeout) {
          timer = setTimeout(() => {
            if (dlItem) {
              dlItem.cancel();
              log.error(url + "[下载超时，已取消]");
            }
          }, timeout);
        }
      };

      DL.download(mainWindow, url, {
        onCancel: e => {
          if (timer) {
            clearTimeout(timer);
          }
          mainWindow.webContents.send("on-download-state", {
            index: args.index || 0,
            progress: 0,
            status: "cancel"
          });
        },
        onProgress: e => {
          if (timer) {
            clearTimeout(timer);
          }
          createTimer();
          mainWindow.webContents.send("on-download-state", {
            index: args.index || 0,
            progress: e,
            status: "running"
          });
        },
        onStarted: e => {
          dlItem = e;
          createTimer();
          mainWindow.webContents.send("on-download-state", {
            index: args.index || 0,
            progress: 0,
            status: "start"
          });
        },
        ...args
      })
        .then(dl => {
          if (timer) {
            clearTimeout(timer);
          }
          log.debug(dl.getSavePath());
          mainWindow.webContents.send("on-download-state", {
            index: args.index || 0,
            progress: 1,
            status: "finished"
          });
        })
        .catch(() => {
          if (timer) {
            clearTimeout(timer);
          }
          mainWindow.webContents.send("on-download-state", {
            index: args.index || 0,
            progress: 0,
            status: "error"
          });
        });
    }
  );

  ipcMain.on("file-download-cancel", () => {
    if (dlItem) {
      dlItem.cancel();
    }
  });

  // 剪贴板监听
  ipcMain.on("read-clipboard", (event: electron.Event) => {
    event.sender.send("get-clipboard-text", clipboard.readText());
  });

  // 写入剪切板监听
  ipcMain.on("write-clipboard", (event: electron.Event, args: string) => {
    clipboard.writeText(args);
  });

  // 获取本机IP地址
  ipcMain.on("get-ip-address", (event: electron.Event) => {
    const network = {};
    network.ip = ip.address();
    event.sender.send("ip-address", network);
  });

  // 获取本机硬件信息
  ipcMain.on("get-device-os", (event: electron.Event) => {
    const deviceInfo = {
      arch: os.arch(),
      cpu: os.cpus(),
      homedir: os.homedir(),
      hostname: os.hostname(),
      memory: os.totalmem(),
      network: os.networkInterfaces(),
      platform: os.platform(),
      release: os.release(),
      tmpdir: os.tmpdir(),
      type: os.type(),
      uptime: os.uptime(),
      userInfo: os.userInfo()
    };
    event.sender.send("device-os", deviceInfo);
  });

  // AES加密字符串
  ipcMain.on("aes-encode", (event: electron.Event, args: any) => {
    const mdString = md5(args.pswd);
    const key = mdString.slice(0, 16);
    const iv = mdString.slice(16);
    event.sender.send("get-aes-encode", crypto.aseEncode(args.data, key, iv));
  });

  // AES解密字符串
  ipcMain.on("aes-decode", (event: electron.Event, args: any) => {
    const mdString = md5(args.pswd);
    const key = mdString.slice(0, 16);
    const iv = mdString.slice(16);
    event.sender.send("get-aes-decode", crypto.aseDecode(args.data, key, iv));
  });
};
