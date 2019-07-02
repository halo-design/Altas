import RPC from './rpc';
import * as qs from 'qs';
import { isMac } from './env';
import { allDeviceObject } from '../config/DeviceDescriptors';
const { dispatch } = RPC;

export const createWindow = (
  entry: object | string,
  options: object,
  injectBridges?: string[],
  callback?: Function
): void => {
  dispatch('create-window', { entry, options, injectBridges });
  RPC.once('get-window-id', (params: { win_uid: string }) => {
    callback && callback(params);
  });
};

export const closeWindow = (uid: string): void => {
  dispatch('close-window', { uid });
};

interface Idebug {
  target: string;
  descriptors?: {
    name: string;
    userAgent: string;
    viewport: {
      width: number;
      height: number;
      deviceScaleFactor: number;
      isMobile: boolean;
      hasTouch: boolean;
      isLandscape: boolean;
    };
  };
  preload?: string;
  insertCSS?: string;
}

export const deviceDevtools = (
  entryPath: string,
  options: Idebug,
  callback?: Function
) => {
  let { descriptors }: any = options;
  if (!descriptors) {
    descriptors = allDeviceObject['iPhone 8 Plus'];
    options['descriptors'] = descriptors;
  }
  const { width, height } = descriptors.viewport;
  createWindow(
    {
      pathname: entryPath,
      hash: qs.stringify(options),
    },
    {
      width,
      height,
      resizable: false,
      movable: true,
      maximizable: false,
      minimizable: false,
      transparent: false,
      backgroundColor: '#fff',
      titleBarStyle: isMac ? 'customButtonsOnHover' : 'hidden',
    },
    [],
    callback
  );
};

export const openDeviceDebug = (options: Idebug, callback?: Function) => {
  deviceDevtools('renderer/devtools.html', options, callback);
};

export const openCheetahDebug = (options: Idebug, callback?: Function) => {
  deviceDevtools('renderer/cheetah.html', options, callback);
};

export const openMarkdownPreview = (remoteUrl?: string) => {
  createWindow(
    {
      pathname: 'renderer/markdown.html',
      hash: qs.stringify({ remoteUrl }),
    },
    {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      resizable: true,
      movable: true,
      maximizable: false,
      minimizable: false,
      transparent: false,
      backgroundColor: '#fff',
      titleBarStyle: isMac ? 'customButtonsOnHover' : 'hidden',
      webPreferences: {
        nodeIntegration: true,
        scrollBounce: false,
        webviewTag: false,
      },
    },
    ['markdown']
  );
};
