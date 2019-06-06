import message from 'antd/lib/message';
import { remote } from 'electron';
import { Provider } from 'mobx-react';
import { configureDevtool } from 'mobx-react-devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import createStores from '../store';
import App from './App';
import RPC from '../utils/rpc';

import '../../../node_modules/antd/es/style/index.css';
import '../../../node_modules/antd/es/message/style/index.css';
import '../../../node_modules/antd/es/notification/style/index.css';
import '../../../node_modules/antd/es/tooltip/style/index.css';
import '../../../node_modules/antd/es/select/style/index.css';
import '../../../node_modules/antd/es/input/style/index.css';
import '../../../node_modules/antd/es/icon/style/index.css';
import '../../../node_modules/antd/es/switch/style/index.css';
import '../../../node_modules/antd/es/button/style/index.css';
import '../../../node_modules/antd/es/modal/style/index.css';
import '../../../node_modules/xterm/dist/xterm.css';

import '../assets/style/app.scss';

message.config({
  top: 540,
});

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  configureDevtool({
    graphEnabled: false,
    logEnabled: true,
    logFilter: ({ type }: any) => /(reaction|update)/.test(type),
    updatesEnabled: false,
  });
}

document.documentElement.classList.add(process.platform);

RPC.on('ready', () => {
  ReactDOM.render(
    <Provider {...createStores()}>
      <Router basename="/">
        <App initPath="/scan" />
      </Router>
    </Provider>,
    document.getElementById('MOUNT_NODE') as HTMLElement
  );

  // 页面节点渲染后显示窗口
  remote.getCurrentWindow().show();
});
