import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import classNames from 'classnames';
import message from 'antd/lib/message';
import Icon from 'antd/lib/icon';

import './index.scss';

import Scan from '../../views/Scan';
import Project from '../../views/Project';
import Store from '../../views/Store';

import Home from '../../views/Home';
import Face from '../../views/Face';
import Refresh from '../../views/Refresh';
import Sync from '../../views/Sync';
import Upload from '../../views/Upload';

@inject((stores: any) => {
  const {
    workStation: { monitorVisible, stateBarText, stateBarStatus, isFreeze },
    terminal: { stdoutRunning },
  } = stores;

  return {
    setMonitorVisible: (state: boolean) =>
      stores.workStation.setMonitorVisible(state),
    monitorVisible,
    stateBarText,
    stateBarStatus,
    isFreeze,
    stdoutRunning,
  };
})
@observer
export default class WorkStation extends React.Component<any> {
  public notice() {
    message.warning('当前操作正在进行！');
  }

  render() {
    const {
      monitorVisible,
      stateBarText,
      stateBarStatus,
      isFreeze,
      stdoutRunning,
    } = this.props;

    const status = stdoutRunning ? -1 : stateBarStatus;
    return (
      <div
        className={classNames('app-work-station', {
          'hide-monitor': !monitorVisible,
        })}
      >
        <div className="app-panel">
          <Switch>
            <Route path="/scan" component={Scan} />
            <Route path="/project" component={Project} />
            <Route path="/store" component={Store} />
            <Route path="/face" component={Face} />
            <Route path="/upload" component={Upload} />
            <Route path="/device" component={Home} />
            <Route path="/sync" component={Sync} />
            <Route path="/refresh" component={Refresh} />
            <Route component={() => <Redirect to={this.props.initPath} />} />
          </Switch>
        </div>
        <div className="app-monitor">
          {this.props.children}
          <div
            className={classNames('app-state-bar', {
              running: status === -1,
              normal: status === 0,
              success: status === 1,
              warn: status === 2,
              error: status === 3,
            })}
          >
            <div className="control">
              <Icon type="api" />
              <span> {stateBarText}</span>
            </div>
            <div className="status">
              {stdoutRunning && <Icon type="sync" spin={true} />}
            </div>
          </div>
        </div>
        {isFreeze && (
          <div className="app-freeze-mask" onClick={e => this.notice()} />
        )}
        <div className="app-header-wrap" />
      </div>
    );
  }
}
