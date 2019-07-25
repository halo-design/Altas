import markdown from './markdown';
import detector from './detector';
import readWrite from './readWrite';
import download from './download';
import crypto from './crypto';
import createProject from './createProject';
import createImageCache from './createImageCache';
import createServer from './createServer';
import createWindow from './createWindow';

export const allBridges = {
  markdown,
  detector,
  readWrite,
  download,
  crypto,
  createProject,
  createImageCache,
  createServer,
  createWindow,
};

export default (RPC: any, bridgeNames: string[]) => {
  bridgeNames.forEach((name: string) => {
    allBridges[name](RPC);
  });
};
