import * as path from 'path';
import * as fs from 'fs-extra';
import { nativeImage } from 'electron';
import { saveFile } from '../../../utils/file';
import log from 'electron-log';
import { appDataFullPath } from '../../../constants/app';

export default (RPC: any) => {
  const { dispatch } = RPC;

  RPC.on(
    'create-image-cache',
    ({ url, saveName, thumbType, width, height }: any) => {
      let img: any = null;

      const isSupportImg =
        thumbType === 'base64' || /\.jpg|\.png|\.jpeg/.test(path.extname(url));

      if (isSupportImg) {
        if (thumbType === 'image') {
          img = nativeImage.createFromPath(url);
        } else {
          img = nativeImage.createFromDataURL(url);
        }
        const buf = img.resize({ width, height }).toPNG();
        const savePath = path.join(appDataFullPath, saveName);
        log.info('[save_image_cache]:' + savePath);

        saveFile(savePath, buf);
        dispatch('image-cache-created', { savePath });
      } else {
        const savePath = path.join(appDataFullPath, saveName);
        fs.copySync(url, savePath);
        dispatch('image-cache-created', { savePath });
        log.info('[copy_image_cache]:' + savePath);
      }
    }
  );
};
