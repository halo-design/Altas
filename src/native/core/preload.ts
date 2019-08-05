import { createDir } from '../utils/file';
import { appCacheFullPath, appDataFullPath } from '../constants/app';

createDir(appCacheFullPath);
createDir(appDataFullPath);
