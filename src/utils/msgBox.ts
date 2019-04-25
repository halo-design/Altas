import { ipcRenderer } from 'electron';

const messageBox = (args: object): void => {
  ipcRenderer.send('on-dialog-message', { type: 'info', ...args });
}

export default messageBox;

