import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import './index.scss';

import Scan from '../../views/Scan';

import Home from '../../views/Home';
import Device from '../../views/Device';
import Face from '../../views/Face';
import Mine from '../../views/Mine';
import Refresh from '../../views/Refresh';
import Sync from '../../views/Sync';
import Upload from '../../views/Upload';

@inject((stores: any) => {
  const {
    workStation: { monitorVisible, stateBarText, stateBarStatus },
  } = stores;

  return {
    setMonitorVisible: (state: boolean) =>
      stores.workStation.setMonitorVisible(state),
    setStateBar: (str: string, code: number) =>
      stores.workStation.setStateBar(str, code),
    monitorVisible,
    stateBarText,
    stateBarStatus,
  };
})
@observer
export default class WorkStation extends React.Component<any> {
  render() {
    const { monitorVisible, stateBarText, stateBarStatus } = this.props;
    return (
      <div
        className={classNames('app-work-station', {
          'hide-monitor': !monitorVisible,
        })}
      >
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
          <div
            className={classNames('app-state-bar', {
              success: stateBarStatus === 0,
              normal: stateBarStatus === 1,
              warn: stateBarStatus === 2,
              error: stateBarStatus === 3,
            })}
          >
            {stateBarText}
          </div>
        </div>
        <div key="app-header-wrap" className="app-header-wrap" />
      </div>
    );
  }
}
