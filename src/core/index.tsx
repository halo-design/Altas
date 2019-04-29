import message from "antd/lib/message";
import { remote } from "electron";
import { Provider } from "mobx-react";
import { configureDevtool } from "mobx-react-devtools";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import store from "../store";
import App from "./App";

import "../assets/style/app.scss";

message.config({
  top: 540
});

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  configureDevtool({
    graphEnabled: false,
    logEnabled: true,
    logFilter: (change: any) => change.type === "reaction",
    updatesEnabled: false
  });
}

document.documentElement.classList.add(process.platform);

ReactDOM.render(
  <Provider {...store}>
    <Router basename="/">
      <App initPath="/home" />
    </Router>
  </Provider>,
  document.getElementById("MOUNT_NODE") as HTMLElement
);

// 页面节点渲染后显示窗口
remote.getCurrentWindow().show();
