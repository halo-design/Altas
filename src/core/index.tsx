import { Provider } from 'mobx-react';
import { configureDevtool } from 'mobx-react-devtools';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import store from '../store';
import { readStorage } from '../utils/bridge';
import App from './App';

import '../assets/style/app.scss';

const isDev = process.env.NODE_ENV === 'development';
const supportsHistory = 'pushState' in window.history;

if (isDev) {
  configureDevtool({
    graphEnabled: false,
    logEnabled: true,
    logFilter: (change: any) => change.type === 'reaction',
    updatesEnabled: false,
  });
}

document.documentElement.classList.add(process.platform);


const renderer = (initPath: string): void => {
  ReactDOM.render(
    <Provider {...store}>
      <Router basename="/" forceRefresh={!supportsHistory}>
        <App initPath={initPath || '/home'} />
      </Router>
    </Provider>,
    document.getElementById("MOUNT_NODE") as HTMLElement
    );
  }
  
  readStorage('altas-last-modify-path', (data: any) => {
    renderer(data.path);
});