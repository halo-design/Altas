import { app } from 'electron';
import * as path from 'path';
import { createDir } from '../utils/file';

export const appCacheFullPath: string = path.join(
  app.getPath('temp'),
  'altas_cache'
);

createDir(appCacheFullPath);
