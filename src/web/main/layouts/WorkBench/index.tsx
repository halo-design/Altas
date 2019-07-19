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
import Tools from '../../views/Tools';
import Settings from '../../views/Settings';
import Refresh from '../../views/Refresh';

import Face from '../../views/Face';
import Sync from '../../views/Sync';

const Stats = require('stats-js');

@inject((stores: any) => {
  const {
    workBench: {
      monitorVisible,
      stateBarText,
      stateBarStatus,
      isFreeze,
      showStats,
    },
    terminal: { stdoutRunning },
  } = stores;

  return {
    setMonitorVisible: (state: boolean) =>
      stores.workBench.setMonitorVisible(state),
    monitorVisible,
    stateBarText,
    stateBarStatus,
    isFreeze,
    stdoutRunning,
    showStats,
  };
})
@observer
export default class WorkBenchView extends React.Component<any> {
  public statsEl: any = null;
  public animateRaf: any = null;

  public notice() {
    message.warning('当前操作正在进行！');
  }

  public componentDidMount() {
    const stats = new Stats();
    const statsDOM = stats.dom;
    statsDOM.style.cssText = `position:fixed;top:10px;left:474px;cursor:pointer;opacity:0.9;z-index:90000`;
    stats.showPanel(0);
    this.statsEl.appendChild(statsDOM);

    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    this.animateRaf = requestAnimationFrame(animate);
  }

  public componentWillUnmount() {
    window.cancelAnimationFrame(this.animateRaf);
  }

  public render() {
    const {
      monitorVisible,
      stateBarText,
      stateBarStatus,
      isFreeze,
      stdoutRunning,
      showStats,
    } = this.props;

    const status = stdoutRunning ? -1 : stateBarStatus;
    return (
      <div
        className={classNames('app-work-bench', {
          'hide-monitor': !monitorVisible,
        })}
      >
        <div className="app-panel">
          <Switch>
            <Route path="/scan" component={Scan} />
            <Route path="/project" component={Project} />
            <Route path="/store" component={Store} />
            <Route path="/tools" component={Tools} />
            <Route path="/settings" component={Settings} />
            <Route path="/face" component={Face} />
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
          <div
            className={classNames('app-stats', {
              hide: !showStats,
            })}
            ref={node => {
              this.statsEl = node;
            }}
          />
        </div>
        {isFreeze && (
          <div className="app-freeze-mask" onClick={e => this.notice()} />
        )}
        <div className="app-header-wrap" />
      </div>
    );
  }
}
