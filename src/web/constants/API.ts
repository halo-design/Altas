import { remote } from 'electron';
const { app } = remote;

export const clearUploadHistory: string = 'https://sm.ms/api/clear';
export const upload: string = 'https://sm.ms/api/upload?inajax=1&ssl=1';
export const uploadHistory: string = 'https://sm.ms/api/list';
export const ipAddress: string = 'https://pv.sohu.com/cityjson';
export const appCacheFullPath: string = app.getPath('temp') + 'altas_cache';
