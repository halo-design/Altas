import { remote } from 'electron';
import * as path from 'path';
const { app } = remote;
import node from '../assets/img/node.png';
import npm from '../assets/img/npm.png';
import vue from '../assets/img/vue.png';
import yarn from '../assets/img/yarn.png';
import eslint from '../assets/img/eslint.png';
import webpack from '../assets/img/webpack.png';
import python from '../assets/img/python.png';

export const appVersion: string = app.getVersion();

export const ipAddress: string = 'https://pv.sohu.com/cityjson';
export const homePage: string = 'https://github.com/halo-design/Altas';
export const feedbackPage: string = 'https://owlaford.gitee.io/#/home/message';

export const clearUploadHistory: string = 'https://sm.ms/api/clear';
export const upload: string = 'https://sm.ms/api/upload?inajax=1&ssl=1';
export const uploadHistory: string = 'https://sm.ms/api/list';
export const cheetahSimulatorIndex: string =
  'http://flameapp.cn/jsapi-test/index.html';

export const appCacheFullPath: string = path.join(
  app.getPath('temp'),
  'altas_cache'
);

export const appDataFullPath: string = path.join(
  app.getPath('userData'),
  'altas_data'
);

export const scrollbarStyleString = `
  body::-webkit-scrollbar {
    width: 0px;
  }

  body::-webkit-scrollbar-thumb {
    background-color: transparent;
  }

  body::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
`;

export const scanAppImages = [
  {
    name: 'node',
    lnk: 'static/' + node,
    color: '#46b438',
  },
  {
    name: 'npm',
    lnk: 'static/' + npm,
    color: '#d32e2d',
  },
  {
    name: 'vue',
    lnk: 'static/' + vue,
    color: '#41b883',
  },
  {
    name: 'yarn',
    lnk: 'static/' + yarn,
    color: '#2c8ebb',
  },
  {
    name: 'eslint',
    lnk: 'static/' + eslint,
    color: '#4b32c3',
  },
  {
    name: 'webpack',
    lnk: 'static/' + webpack,
    color: '#8ed6fb',
  },
  {
    name: 'python',
    lnk: 'static/' + python,
    color: '#0075aa',
  },
];
