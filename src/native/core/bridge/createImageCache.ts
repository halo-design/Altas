import * as path from 'path';
import { nativeImage } from 'electron';
import { saveFile } from '../../utils/file';
import log from 'electron-log';
import { appCacheFullPath } from '../constants';

export default (RPC: any) => {
  const { dispatch } = RPC;

  RPC.on('create-image-cache', ({ url, saveName, width, height }: any) => {
    const img = nativeImage.createFromPath(url);
    const buf = img.resize({ width, height }).toPNG();
    const savePath = path.join(appCacheFullPath, saveName);
    log.info('[save_image_cache]:' + savePath);

    saveFile(savePath, buf);
    dispatch('image-cache-created', { savePath });
  });
};
