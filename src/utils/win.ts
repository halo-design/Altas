import { remote } from "electron";
const { app, getCurrentWindow } = remote;

interface IWin {
  quit: () => void;
  close: () => void;
  isMax: () => boolean;
  restore: () => void;
  maximize: () => void;
  unmaximize: () => void;
  minimize: () => void;
}

const win: IWin = {
  close: () => {
    getCurrentWindow().close();
  },
  isMax: () => getCurrentWindow().isMaximized(),
  maximize: () => {
    getCurrentWindow().maximize();
  },
  minimize: () => {
    getCurrentWindow().minimize();
  },
  quit: () => {
    app.quit();
  },
  restore: () => {
    getCurrentWindow().restore();
  },
  unmaximize: () => {
    getCurrentWindow().unmaximize();
  }
};

export default win;
