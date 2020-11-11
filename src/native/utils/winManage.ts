import { BrowserWindow } from 'electron';

export const traversalAllWindows = (
  fn: (win: Electron.BrowserWindow) => void
) => {
  BrowserWindow.getAllWindows().forEach((win: Electron.BrowserWindow) => {
    fn(win);
  });
};

export const sendToAllWindows = (key: string, data: any) => {
  traversalAllWindows((win: Electron.BrowserWindow) => {
    win.webContents.send(key, data);
  });
};
