import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';

@inject((stores: any) => {
  const { loginShowState } = stores.webview;

  return {
    loginShowState,
    setRpcSettingsVisible: (state: boolean) =>
      stores.webview.setRpcSettingsVisible(state),
    submitLogin: () => stores.webview.submitLogin(),
    setLogintState: (state: boolean) => stores.webview.setLogintState(state),
  };
})
@observer
class LoginView extends React.Component<any, any> {
  public render() {
    const {
      loginShowState,
      setLogintState,
      setRpcSettingsVisible,
      submitLogin,
    } = this.props;
    return (
      <div
        className={classnames('app-login-view', {
          show: loginShowState,
        })}
      >
        <div className="login-form">
          <div className="avatar" />
          <button
            className="login-btn"
            onClick={() => {
              submitLogin();
            }}
          >
            一键登录
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
