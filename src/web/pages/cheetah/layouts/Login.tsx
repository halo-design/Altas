import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { urlTest } from '../../../main/constants/Reg';
import Toast from 'antd-mobile/lib/toast';

@inject((stores: any) => {
  const {
    loginShowState,
    rpcOperationType,
    userName,
    userPassword,
  } = stores.webview;

  return {
    userName,
    userPassword,
    loginShowState,
    rpcOperationType,
    submitLogin: (userName: string, userPassword: string) =>
      stores.webview.submitLogin(userName, userPassword),
    setLogintState: (state: boolean) => stores.webview.setLogintState(state),
    setRpcOperationSettings: (config: any) =>
      stores.webview.setRpcOperationSettings(config),
  };
})
@observer
class LoginView extends React.Component<any, any> {
  public rpcRemoteUrlEl: any = null;
  public rpcOperationTypeRegEl: any = null;
  public rpcOperationTypeReplaceStringEl: any = null;
  public rpcOperationLoginInterfaceEl: any = null;
  public rpcOperationLoginSuccessCodeEl: any = null;
  public rpcOperationLoginErrorMsgPositionEl: any = null;
  public rpcOperationSessionIDPositionEl: any = null;
  public rpcOperationLoginErrorCodePositionEl: any = null;
  public userNameEl: any = null;
  public userPswdEl: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      rpcSettingsVisible: false,
    };
  }

  public setRpcSettingsVisible(state: boolean) {
    this.setState({
      rpcSettingsVisible: state,
    });
  }

  public savePrcSettingsHandle() {
    const rpcRemoteUrl = this.rpcRemoteUrlEl.value;
    const rpcOperationTypeReg = this.rpcOperationTypeRegEl.value;
    const rpcOperationTypeReplaceString = this.rpcOperationTypeReplaceStringEl
      .value;
    const rpcOperationLoginInterface = this.rpcOperationLoginInterfaceEl.value;
    const rpcOperationLoginSuccessCode = this.rpcOperationLoginSuccessCodeEl
      .value;
    const rpcOperationLoginErrorMsgPosition = this
      .rpcOperationLoginErrorMsgPositionEl.value;
    const rpcOperationSessionIDPosition = this.rpcOperationSessionIDPositionEl
      .value;
    const rpcOperationLoginErrorCodePosition = this
      .rpcOperationLoginErrorCodePositionEl.value;

    if (!urlTest(rpcRemoteUrl)) {
      Toast.fail('请输入合法url');
    } else if (rpcOperationTypeReg.length === 0) {
      Toast.fail('请输入接口匹配替换正则');
    } else if (rpcOperationTypeReplaceString.length === 0) {
      Toast.fail('请输入接口匹配替换字符串');
    } else if (rpcOperationLoginInterface.length === 0) {
      Toast.fail('请输入登录接口名');
    } else if (rpcOperationLoginSuccessCode.length === 0) {
      Toast.fail('请输入登录成功码');
    } else if (rpcOperationLoginErrorCodePosition.length === 0) {
      Toast.fail('请输入登录结果码节点');
    } else if (rpcOperationLoginErrorMsgPosition.length === 0) {
      Toast.fail('请输入错误信息节点');
    } else if (rpcOperationSessionIDPosition.length === 0) {
      Toast.fail('请输入SessionID数据节点');
    } else {
      this.props.setRpcOperationSettings({
        rpcRemoteUrl,
        rpcOperationTypeReg,
        rpcOperationTypeReplaceString,
        rpcOperationLoginInterface,
        rpcOperationLoginSuccessCode,
        rpcOperationLoginErrorMsgPosition,
        rpcOperationLoginErrorCodePosition,
        rpcOperationSessionIDPosition,
      });
      this.setRpcSettingsVisible(false);
    }
  }

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
      rpcOperationType: {
        rpcRemoteUrl,
        rpcOperationTypeReg,
        rpcOperationTypeReplaceString,
        rpcOperationLoginInterface,
        rpcOperationLoginSuccessCode,
        rpcOperationLoginErrorCodePosition,
        rpcOperationLoginErrorMsgPosition,
        rpcOperationSessionIDPosition,
      },
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
            this.setRpcSettingsVisible(true);
          }}
        >
          <i className="iconfont">&#xe602;</i>
          <span>设置RPC和登录</span>
        </div>
        <div
          className={classnames('rpc-config-settings', {
            show: this.state.rpcSettingsVisible,
          })}
        >
          <div className="rpc-config-panel">
            <div className="title">设置RPC和登录</div>
            <div className="form-list-wrap">
              <div className="form-list">
                <div className="form-item">
                  <label>请输入服务器地址：</label>
                  <input
                    type="text"
                    defaultValue={rpcRemoteUrl}
                    ref={node => {
                      this.rpcRemoteUrlEl = node;
                    }}
                    placeholder="请输入服务器地址"
                  />
                </div>
                <div className="form-item">
                  <label>接口匹配替换正则：</label>
                  <input
                    type="text"
                    defaultValue={rpcOperationTypeReg}
                    ref={node => {
                      this.rpcOperationTypeRegEl = node;
                    }}
                    placeholder="请输入替换正则"
                  />
                </div>
                <div className="form-item">
                  <label>接口匹配替换字符串：</label>
                  <input
                    type="text"
                    defaultValue={rpcOperationTypeReplaceString}
                    ref={node => {
                      this.rpcOperationTypeReplaceStringEl = node;
                    }}
                    placeholder="请输入替换字符串"
                  />
                </div>
                <div className="form-item">
                  <label>登录接口名：</label>
                  <input
                    type="text"
                    defaultValue={rpcOperationLoginInterface}
                    ref={node => {
                      this.rpcOperationLoginInterfaceEl = node;
                    }}
                    placeholder="请输入登录接口名"
                  />
                </div>
                <div className="form-item">
                  <label>登录成功码：</label>
                  <input
                    type="text"
                    defaultValue={rpcOperationLoginSuccessCode}
                    ref={node => {
                      this.rpcOperationLoginSuccessCodeEl = node;
                    }}
                    placeholder="请输入登录成功码"
                  />
                </div>
                <div className="form-item">
                  <label>登录结果码节点：</label>
                  <input
                    type="text"
                    defaultValue={rpcOperationLoginErrorCodePosition}
                    ref={node => {
                      this.rpcOperationLoginErrorCodePositionEl = node;
                    }}
                    placeholder="请输入错误码数据节点"
                  />
                </div>
                <div className="form-item">
                  <label>错误信息节点：</label>
                  <input
                    type="text"
                    defaultValue={rpcOperationLoginErrorMsgPosition}
                    ref={node => {
                      this.rpcOperationLoginErrorMsgPositionEl = node;
                    }}
                    placeholder="请输入错误码数据节点"
                  />
                </div>
                <div className="form-item">
                  <label>SessionID数据节点：</label>
                  <input
                    type="text"
                    defaultValue={rpcOperationSessionIDPosition}
                    ref={node => {
                      this.rpcOperationSessionIDPositionEl = node;
                    }}
                    placeholder="请输入SessionID数据节点"
                  />
                </div>
                <div className="btn-group">
                  <div
                    className="btn close"
                    onClick={() => {
                      this.setRpcSettingsVisible(false);
                    }}
                  >
                    取消
                  </div>
                  <div
                    className="btn save"
                    onClick={() => {
                      this.savePrcSettingsHandle();
                    }}
                  >
                    保存
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginView;
