import * as path from 'path';
import { nativeImage } from 'electron';
import { saveFile } from '../../utils/file';
import log from 'electron-log';
import { appCacheFullPath } from '../constants';

export default (RPC: any) => {
  const { dispatch } = RPC;

  RPC.on(
    'create-image-cache',
    ({ url, saveName, thumbType, width, height }: any) => {
      let img: any = null;
      if (thumbType === 'image') {
        img = nativeImage.createFromPath(url);
      } else {
        img = nativeImage.createFromDataURL(url);
      }
      const buf = img.resize({ width, height }).toPNG();
      const savePath = path.join(appCacheFullPath, saveName);
      log.info('[save_image_cache]:' + savePath);

      saveFile(savePath, buf);
      dispatch('image-cache-created', { savePath });
    }
  );
};
