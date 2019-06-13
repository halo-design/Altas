import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Modal from 'antd/lib/modal';
import Input from 'antd/lib/input';
import { isMac } from '../../bridge/env';

import './index.scss';

@inject((stores: any) => {
  const {
    adminAuthorizationStatus,
    userPassword,
    adminAuthorizationModalVisible,
  } = stores.terminal;

  return {
    adminAuthorizationStatus,
    userPassword,
    adminAuthorizationModalVisible,
    init: (el: HTMLElement) => stores.terminal.init(el),
    destroy: () => stores.terminal.destroy(),
    adminAuthorization: () => stores.terminal.adminAuthorization(),
    handleChangeUserPassword: (str: string) =>
      stores.terminal.handleChangeUserPassword(str),
    setAdminAuthorizationModalVisible: (state: boolean) =>
      stores.terminal.setAdminAuthorizationModalVisible(state),
  };
})
@observer
class TerminalView extends React.Component<any> {
  public terminalEl: any = null;

  public componentDidMount() {
    if (this.terminalEl) {
      this.props.init(this.terminalEl);
    }
  }

  public componentWillUnmount() {
    this.props.destroy();
  }

  public render() {
    return (
      <div className="app-terminal">
        <div
          className="terminal"
          ref={node => {
            this.terminalEl = node;
          }}
        />
        {isMac && (
          <Modal
            title="请输入系统管理员密码"
            visible={this.props.adminAuthorizationModalVisible}
            onOk={() => this.props.adminAuthorization()}
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
        )}
      </div>
    );
  }
}

export default TerminalView;
