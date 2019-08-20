import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import Toast from 'antd-mobile/lib/toast';

@inject((stores: any) => {
  const { loginShowState, userName, userPassword } = stores.webview;

  return {
    userName,
    userPassword,
    loginShowState,
    setRpcSettingsVisible: (state: boolean) =>
      stores.webview.setRpcSettingsVisible(state),
    submitLogin: (userName: string, userPassword: string) =>
      stores.webview.submitLogin(userName, userPassword),
    setLogintState: (state: boolean) => stores.webview.setLogintState(state),
  };
})
@observer
class LoginView extends React.Component<any, any> {
  public userNameEl: any = null;
  public userPswdEl: any = null;

  public login() {
    const userName = this.userNameEl.value;
    const userPassword = this.userPswdEl.value;

    if (userName.length === 0) {
      Toast.fail('请输入账号');
    } else if (userPassword.length === 0) {
      Toast.fail('请输入密码');
    } else {
      this.props.submitLogin(userName, userPassword);
    }
  }

  public render() {
    const {
      userName,
      userPassword,
      loginShowState,
      setLogintState,
      setRpcSettingsVisible,
    } = this.props;
    return (
      <div
        className={classnames('app-login-view', {
          show: loginShowState,
        })}
      >
        <div className="login-form">
          <div className="avatar" />
          <div className="form-item">
            <label>账号</label>
            <input
              type="text"
              placeholder="请输入账号"
              defaultValue={userName}
              ref={node => {
                this.userNameEl = node;
              }}
            />
          </div>
          <div className="form-item">
            <label>密码</label>
            <input
              type="password"
              placeholder="请输入密码"
              defaultValue={userPassword}
              ref={node => {
                this.userPswdEl = node;
              }}
            />
          </div>
          <button
            className="login-btn"
            onClick={() => {
              this.login();
            }}
          >
            登录
          </button>
        </div>
        <div
          className="close-login-page"
          onClick={() => {
            setLogintState(false);
          }}
        >
          暂不登录
        </div>
        <div
          className="set-rpc-server"
          onClick={() => {
            setRpcSettingsVisible(true);
          }}
        >
          <i className="iconfont">&#xe602;</i>
          <span>设置RPC和登录</span>
        </div>
      </div>
    );
  }
}

export default LoginView;
