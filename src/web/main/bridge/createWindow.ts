import RPC from './rpc';
import * as qs from 'qs';
import { allDeviceObject } from '../config/DeviceDescriptors';
const { dispatch } = RPC;

export const createWindow = (
  winId: string,
  entry: object | string,
  options: object,
  injectBridges?: string[],
  callback?: Function
): void => {
  dispatch('create-window', { entry, options, injectBridges, winId });
  RPC.once('get-window-id', (params: { winId: string }) => {
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
  winId: string,
  entryPath: string,
  options: Idebug,
  inject?: string[],
  callback?: Function
) => {
  let { descriptors }: any = options;
  if (!descriptors) {
    descriptors = allDeviceObject['iPhone 8 Plus'];
    options['descriptors'] = descriptors;
  }
  const { width, height } = descriptors.viewport;
  createWindow(
    winId,
    {
      pathname: entryPath,
      hash: qs.stringify(options),
    },
    {
      width: width,
      height,
      resizable: false,
      movable: true,
      maximizable: false,
      minimizable: false,
      transparent: true,
      titleBarStyle: 'hidden',
    },
    inject || [],
    callback
  );
};

export const deviceSimulator = (options: Idebug, callback?: Function) => {
  deviceDevtools(
    'deviceSimulator',
    'renderer/devtools.html',
    options,
    [],
    callback
  );
};

export const cheetahSimulator = (options: Idebug, callback?: Function) => {
  deviceDevtools(
    'cheetahSimulator',
    'renderer/cheetah.html',
    options,
    ['createWindow', 'createMocker'],
    callback
  );
};

export const markdownViewer = (remoteUrl?: string) => {
  createWindow(
    '',
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
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        scrollBounce: false,
        webviewTag: false,
      },
    },
    ['markdown']
  );
};

export const mockProxyServer = () => {
  createWindow(
    'mockProxyServer',
    {
      pathname: 'renderer/mocker.html',
      hash: '',
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
      backgroundColor: '#252627',
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        scrollBounce: false,
        webviewTag: false,
      },
    },
    ['createMockProxyServer', 'createMocker']
  );
};
