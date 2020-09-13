import * as qs from 'qs';
import { remote } from 'electron';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import createStores from './stores';
import App from './core/App';
import RPC from '../../main/bridge/rpc';
import { DeviceContext } from './context';

const { getCurrentWindow } = remote;
const currentWindow = getCurrentWindow();

const options = qs.parse(location.hash.substr(1));
options.currentWindow = currentWindow;

import '../devtools/index.scss';
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
    <DeviceContext.Provider value={options}>
      <Provider {...createStores()}>
        <App />
      </Provider>
    </DeviceContext.Provider>,
    document.getElementById('MOUNT_NODE') as HTMLElement
  );
});
