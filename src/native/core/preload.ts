import { createDirSync } from '../utils/file';
import { appCacheFullPath, appDataFullPath } from '../constants/app';

createDirSync(appCacheFullPath);
createDirSync(appDataFullPath);
