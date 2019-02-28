// import blueGrey from '@material-ui/core/colors/blueGrey';
// import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { remote } from 'electron';
import { Provider } from 'mobx-react';
import { configureDevtool } from 'mobx-react-devtools';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-util';
import store from '../store';
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

// const theme = createMuiTheme({
//   palette: {
//     primary: blueGrey,
//   },
//   typography: {
//     fontFamily: [
//       'Avenir',
//       'Tahoma',
//       'Arial',
//       'PingFang SC',
//       'Lantinghei SC',
//       'Microsoft Yahei',
//       'Hiragino Sans GB',
//       'Microsoft Sans Serif',
//       'WenQuanYi Micro Hei',
//       'Helvetica',
//       'sans-serif'
//     ].join(','),
//     htmlFontSize: 10,
//   },
// });

ReactDOM.render(
  <Provider {...store}>
    <Router basename="/" forceRefresh={!supportsHistory}>
      {/* <MuiThemeProvider theme={theme}> */}
        <SnackbarProvider
          maxSnack={4}
          action={[
            <CloseIcon color="inherit" key="close" />
          ]}
        >
          <App initPath="/home" />
        </SnackbarProvider>
      {/* </MuiThemeProvider> */}
    </Router>
  </Provider>,
  document.getElementById('MOUNT_NODE') as HTMLElement
);

// 页面节点渲染后显示窗口
remote.getCurrentWindow().show();
