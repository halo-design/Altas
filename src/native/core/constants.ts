import { app } from 'electron';
import * as path from 'path';
import { createDir } from '../utils/file';

export const appCacheFullPath: string = path.join(
  app.getPath('temp'),
  'altas_cache'
);

export const appDataFullPath: string = path.join(
  app.getPath('userData'),
  'altas_data'
);

createDir(appCacheFullPath);
createDir(appDataFullPath);
