import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './index.scss';

import Scan from '../../views/Scan';

import Home from '../../views/Home';
import Device from '../../views/Device';
import Face from '../../views/Face';
import Mine from '../../views/Mine';
import Refresh from '../../views/Refresh';
import Sync from '../../views/Sync';
import Upload from '../../views/Upload';

interface IProps {
  initPath: string;
  children: any;
}

export default class WorkStation extends React.Component<IProps> {
  render() {
    return (
      <div className="app-work-station">
        <div className="app-panel" key="app-main-content">
          <Switch>
            <Route path="/scan" component={Scan} />
            <Route path="/home" component={Home} />
            <Route path="/face" component={Face} />
            <Route path="/upload" component={Upload} />
            <Route path="/mine" component={Mine} />
            <Route path="/device" component={Device} />
            <Route path="/sync" component={Sync} />
            <Route path="/refresh" component={Refresh} />
            <Route component={() => <Redirect to={this.props.initPath} />} />
          </Switch>
        </div>
        <div className="app-monitor">
          {this.props.children}
          <div className="app-state-bar">等待操作</div>
        </div>
        <div key="app-header-wrap" className="app-header-wrap" />
      </div>
    );
  }
}
