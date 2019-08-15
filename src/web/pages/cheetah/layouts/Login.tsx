import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';

@inject((stores: any) => {
  const { loginShowState } = stores.webview;

  return {
    loginShowState,
    setLogintState: (state: boolean) => stores.webview.setLogintState(state),
  };
})
@observer
class LoginView extends React.Component<any, any> {
  public render() {
    const { loginShowState, setLogintState } = this.props;
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
            <input type="text" placeholder="请输入账号" />
          </div>
          <div className="form-item">
            <label>密码</label>
            <input type="password" placeholder="请输入密码" />
          </div>
          <button className="login-btn">登录</button>
        </div>
        <div
          className="close-login-page"
          onClick={() => {
            setLogintState(false);
          }}
        >
          暂不登录
        </div>
      </div>
    );
  }
}

export default LoginView;
