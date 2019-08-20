import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { urlTest } from '../../../main/constants/Reg';
import Toast from 'antd-mobile/lib/toast';

@inject((stores: any) => {
  const { rpcOperationType, rpcSettingsVisible } = stores.webview;

  return {
    rpcOperationType,
    rpcSettingsVisible,
    setRpcSettingsVisible: (state: boolean) =>
      stores.webview.setRpcSettingsVisible(state),
    setLogintState: (state: boolean) => stores.webview.setLogintState(state),
    setRpcOperationSettings: (config: any) =>
      stores.webview.setRpcOperationSettings(config),
  };
})
@observer
class SettingsView extends React.Component<any, any> {
  public rpcRemoteUrlEl: any = null;
  public rpcOperationTypeRegEl: any = null;
  public rpcOperationTypeReplaceStringEl: any = null;
  public rpcOperationLoginInterfaceEl: any = null;
  public rpcOperationLoginSuccessCodeEl: any = null;
  public rpcOperationLoginErrorMsgPositionEl: any = null;
  public rpcOperationSessionIDPositionEl: any = null;
  public rpcOperationLoginErrorCodePositionEl: any = null;

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
      this.props.setRpcSettingsVisible(false);
    }
  }

  public render() {
    const {
      rpcSettingsVisible,
      setRpcSettingsVisible,
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
        className={classnames('rpc-config-settings', {
          show: rpcSettingsVisible,
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
                    setRpcSettingsVisible(false);
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
    );
  }
}

export default SettingsView;
