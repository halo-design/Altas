import markdown from './modules/markdown';
import detector from './modules/detector';
import readWrite from './modules/readWrite';
import download from './modules/download';
import crypto from './modules/crypto';
import createProject from './modules/createProject';
import createImageCache from './modules/createImageCache';
import createServer from './modules/createServer';
import createWindow from './modules/createWindow';
import createMockProxyServer from './modules/createMockProxyServer';
import createMocker from './modules/createMocker';

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
  createMockProxyServer,
  createMocker,
};

export default (RPC: any, bridgeNames: string[]) => {
  bridgeNames.forEach((name: string) => {
    allBridges[name](RPC);
  });
};
