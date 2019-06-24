import { app, ipcMain, dialog } from 'electron';
import file from '../../utils/file';

export default () => {
  ipcMain.on('read-local-file', (event: any) => {
    dialog.showOpenDialog(
      {
        defaultPath: app.getPath('home'),
        buttonLabel: '打开',
        properties: ['openFile'],
        filters: [
          {
            name: '*',
            extensions: ['md', 'markdown'],
          },
        ],
        title: '选择要预览的markdown文件',
      },
      (filepath: string[] | undefined) => {
        if (filepath && filepath[0]) {
          const fpath = filepath[0];
          const content = file.read(fpath);
          event.sender.send('get-local-file-content', {
            directory: path.join(fpath, '../'),
            content,
            filepath: fpath,
          });
        }
      }
    );
  });
};
