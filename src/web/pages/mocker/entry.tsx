import { Provider } from 'mobx-react';
import { remote } from 'electron';
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

if (!remote.app.isPackaged) {
  const devTools = require('mobx-react-devtools');
  devTools.configureDevtool({
    graphEnabled: false,
    logEnabled: true,
    logFilter: ({ type }: any) => type === 'action',
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
