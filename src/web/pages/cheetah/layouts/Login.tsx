import * as React from 'react';

class LoginView extends React.Component<any, any> {
  public render() {
    return (
      <div className="app-login-view show">
        <div className="login-form">
          <div className="avatar" />
          <div className="form-item">
            <label>账号</label>
            <input type="text" value="" placeholder="请输入账号" />
          </div>
          <div className="form-item">
            <label>密码</label>
            <input type="text" value="" placeholder="请输入密码" />
          </div>
          <button className="login-btn">登录</button>
        </div>
        <div className="close-login-page">暂不登录</div>
      </div>
    );
  }
}

export default LoginView;
