import { BrowserWindow } from 'electron';
const windowStateKeeper = require('electron-window-state');

const winStateKeeper = (opts: any) => {
  const { width, height } = opts;

  const winState = windowStateKeeper({
    defaultHeight: height,
    defaultWidth: width,
  });

  const win = new BrowserWindow({
    ...opts,
    x: winState.x,
    y: winState.y,
    width: winState.width,
    height: winState.height,
  });

  winState.manage(win);

  return win;
};

export default winStateKeeper;
