import * as qs from 'qs';
import { remote } from 'electron';
import { Provider } from 'mobx-react';
import { configureDevtool } from 'mobx-react-devtools';
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
    <DeviceContext.Provider value={options}>
      <Provider {...createStores()}>
        <App />
      </Provider>
    </DeviceContext.Provider>,
    document.getElementById('MOUNT_NODE') as HTMLElement
  );
});
