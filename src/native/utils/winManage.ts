import { BrowserWindow } from 'electron';

export const traversalAllWindows = (
  fn: (win: Electron.BrowserWindow) => void
) => {
  BrowserWindow.getAllWindows().forEach((win: Electron.BrowserWindow) => {
    fn(win);
  });
};

export const sendToAllWindows = (key: string, data: object) => {
  traversalAllWindows((win: Electron.BrowserWindow) => {
    win.webContents.send(key, data);
  });
};
