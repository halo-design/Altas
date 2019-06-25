import RPC from './rpc';
const { dispatch } = RPC;

export const readLocalFile = (cb: (args: object) => void): void => {
  dispatch('read-local-file', '');
  RPC.once('get-local-file-content', (args: object) => {
    cb(args);
  });
};

export const downloadPreviewFile = (
  url: string,
  success: Function,
  faild?: Function
) => {
  dispatch('download-preview-file', { url });
  RPC.once('download-preview-file-result', (params: any) => {
    const { result } = params;
    if (/(completed|cancelled|interrupted|timeout)/.test(result)) {
      RPC.removeListener('download-preview-file-result', () => {});
      faild && faild();
    }
    success(params);
  });
};

export const readLocalFileSync = () =>
  new Promise((resolve, reject) => {
    readLocalFile((args: object) => {
      resolve(args);
    });
  });
