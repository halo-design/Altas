import * as React from 'react';
import * as ReactDOM from 'react-dom';
import RPC from '../../main/bridge/rpc';
import App from './core/App';

import '../markdown/index.scss';
import './styles/index.scss';

RPC.on('ready', () => {
  ReactDOM.render(<App />, document.getElementById(
    'MOUNT_NODE'
  ) as HTMLElement);
});
