import { Provider } from 'mobx-react';
import { configureDevtool } from 'mobx-react-devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import createStores from './stores';
import RPC from '../../main/bridge/rpc';
import App from './core/App';

import '../../../../node_modules/antd/es/style/index.css';
import '../../../../node_modules/antd/es/grid/style/index.css';
import '../../../../node_modules/antd/es/form/style/index.css';
import '../../../../node_modules/antd/es/switch/style/index.css';
import '../../../../node_modules/antd/es/button/style/index.css';
import '../../../../node_modules/antd/es/input/style/index.css';
import '../../../../node_modules/antd/es/message/style/index.css';
import '../../../../node_modules/antd/es/modal/style/index.css';
import '../../../../node_modules/antd/es/tooltip/style/index.css';
import '../../../../node_modules/antd/es/icon/style/index.css';
import '../../../../node_modules/xterm/css/xterm.css';
import '../markdown/index.scss';
import './styles/index.scss';

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  configureDevtool({
    graphEnabled: false,
    logEnabled: true,
    logFilter: ({ type }: any) => /(action|update)/.test(type),
    updatesEnabled: false,
  });
}

RPC.on('ready', () => {
  ReactDOM.render(
    <Provider {...createStores()}>
      <App />
    </Provider>,
    document.getElementById('MOUNT_NODE') as HTMLElement
  );
});
