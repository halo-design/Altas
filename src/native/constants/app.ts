import { app } from 'electron';
import * as path from 'path';

export const appCacheFullPath: string = path.join(
  app.getPath('temp'),
  'altas_cache'
);

export const appDataFullPath: string = path.join(
  app.getPath('userData'),
  'altas_data'
);
