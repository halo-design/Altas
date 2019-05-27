const windowStateKeeper = require('electron-window-state');

interface Ikeeper {
  width: number;
  height: number;
}

const keeper = (win: Electron.BrowserWindow, { width, height }: Ikeeper) => {
  const winState = windowStateKeeper({
    defaultHeight: height,
    defaultWidth: width,
  });

  win.setSize(winState.width, winState.height);
  win.setPosition(winState.x, winState.y);

  winState.manage(win);

  return win;
};

export default keeper;
