import { ipcRenderer, remote } from "electron";
const { app, dialog, getCurrentWindow } = remote;

export const setSaveAs = (
  fileName: string,
  afterFn: (e: string) => void
): void => {
  dialog.showSaveDialog(
    getCurrentWindow(),
    {
      defaultPath: app.getPath("downloads") + "/" + fileName
    },
    (filename: any) => {
      if (filename) {
        afterFn(filename);
      }
    }
  );
};

export const selectFile = (
  args: object,
  cb: (e: string[] | undefined) => void
): void => {
  dialog.showOpenDialog(
    {
      defaultPath: "../Desktop",
      ...args
    },
    cb
  );
};

export const readTxtByLine = (
  filePath: string,
  readFn: (e: object) => void
) => {
  ipcRenderer.send("read-text", filePath);
  ipcRenderer.on("get-text-line", (event: any, params: any) => {
    readFn(params);
    if (params.status === "done") {
      ipcRenderer.removeAllListeners("get-text-line");
    }
  });
};
