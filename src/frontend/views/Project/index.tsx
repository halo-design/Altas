import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import { Route, Switch, NavLink, Redirect } from 'react-router-dom';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import message from 'antd/lib/message';
import Create from '../Create';
import Runner from '../Runner';
import { isMac } from '../../utils/env';

import './index.scss';

@inject((stores: any) => {
  const {
    userDefaultProjectPath,
    userPassword,
    adminAuthorizationModalVisible,
    adminAuthorizationStatus,
  } = stores.workStation;

  return {
    userDefaultProjectPath,
    userPassword,
    adminAuthorizationModalVisible,
    adminAuthorizationStatus,
    showTerm: () => stores.terminal.show(),
    hideRadar: () => stores.radar.hide(),
    shell: (str: string) => stores.terminal.shell(str),
    setExecPath: (str: string, force: boolean) =>
      stores.terminal.setExecPath(str, force),
    getLocalUserProjectPath: () => stores.workStation.getLocalUserProjectPath(),
    setUserDefaultProjerctPath: (str: string) =>
      stores.workStation.setUserDefaultProjerctPath(str),
    handleChangeUserPassword: (str: string) =>
      stores.workStation.handleChangeUserPassword(str),
    setAdminAuthorizationModalVisible: (state: boolean) =>
      stores.workStation.setAdminAuthorizationModalVisible(state),
    setAdminAuthorizationStatus: (state: boolean) =>
      stores.workStation.setAdminAuthorizationStatus(state),
  };
})
@observer
class ProjectView extends React.Component<any, any> {
  public componentDidMount() {
    this.props.showTerm();
    this.props.hideRadar();
    if (this.props.userDefaultProjectPath) {
      this.props.setExecPath(this.props.userDefaultProjectPath);
    }
    this.initAuth();
  }

  public initAuth() {
    if (isMac && !this.props.adminAuthorizationStatus) {
      this.props.setAdminAuthorizationModalVisible(true);
    }
  }

  @action
  public adminAuthorization() {
    if (!this.props.userPassword) {
      message.warn('密码不能为空！');
    } else {
      this.props.shell('sudo -s\n');
      const timer = setTimeout(() => {
        this.props.shell(`${this.props.userPassword}\n`);
        this.props.setAdminAuthorizationModalVisible(false);
        this.props.setAdminAuthorizationStatus(true);
        clearTimeout(timer);
      }, 300);
    }
  }

  public render() {
    return (
      <div className="page-project">
        <div className="app-switch">
          <NavLink
            exact={true}
            to="/project/create"
            className="item-btn"
            activeClassName="active"
          >
            创建项目
          </NavLink>
          <NavLink
            exact={true}
            to="/project/runner"
            className="item-btn"
            activeClassName="active"
          >
            运行项目
          </NavLink>
        </div>
        <Switch>
          <Route path="/project/create" component={Create} />
          <Route path="/project/runner" component={Runner} />
          <Route
            path="/project"
            component={() => (
              <Redirect
                to={`/project/${
                  this.props.userDefaultProjectPath ? 'runner' : 'create'
                }`}
              />
            )}
          />
        </Switch>
        <Modal
          title="请输入管理员密码"
          visible={this.props.adminAuthorizationModalVisible}
          onOk={() => this.adminAuthorization()}
          onCancel={() => this.props.setAdminAuthorizationModalVisible(false)}
          closable={false}
          okText="确定"
          cancelText="取消"
          width={340}
        >
          <Input
            placeholder="请输入密码"
            type="password"
            size="large"
            onChange={(e: any) => {
              this.props.handleChangeUserPassword(e.target.value);
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default ProjectView;
