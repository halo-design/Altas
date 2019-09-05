import * as React from 'react';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { urlTest } from '../../../main/constants/Reg';
import Toast from 'antd-mobile/lib/toast';
import TextareaItem from 'antd-mobile/lib/textarea-item';
const stringifyObject = require('stringify-object');
const { createForm } = require('rc-form');

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
  public savePrcSettingsHandle() {
    this.props.form.validateFields((error: any, value: any) => {
      if (error) {
        Toast.fail('请输入完整内容');
        return;
      }
      if (!urlTest(value.rpcRemoteUrl)) {
        Toast.fail('请输入合法url');
      } else if (value.rpcOperationTypeReg.length === 0) {
        Toast.fail('请输入接口匹配替换正则');
      } else if (value.rpcOperationTypeReplaceString.length === 0) {
        Toast.fail('请输入接口匹配替换字符串');
      } else if (value.rpcOperationLoginInterface.length === 0) {
        Toast.fail('请输入登录接口名');
      } else if (value.rpcOperationLoginSuccessCode.length === 0) {
        Toast.fail('请输入登录成功码');
      } else if (value.rpcOperationLoginErrorCodePosition.length === 0) {
        Toast.fail('请输入登录结果码节点');
      } else if (value.rpcOperationLoginErrorMsgPosition.length === 0) {
        Toast.fail('请输入错误信息节点');
      } else if (value.rpcOperationSessionIDPosition.length === 0) {
        Toast.fail('请输入SessionID数据节点');
      } else if (value.rpcData.length === 0) {
        Toast.fail('请输入RPC请求报文配置');
      } else if (value.rpcLogin.length === 0) {
        Toast.fail('请输入登录报文配置');
      } else {
        try {
          const rpcData = eval(`() => (${value.rpcData})`)();
          const rpcLogin = eval(`() => (${value.rpcLogin})`)();

          this.props.setRpcOperationSettings({
            ...value,
            rpcData,
            rpcLogin,
          });
          this.props.setRpcSettingsVisible(false);
        } catch (err) {
          if (err) {
            Toast.fail('请正确填写RPC请求头和登录参数内容！');
          }
        }
      }
    });
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
        rpcData,
        rpcLogin,
      },
      form: { getFieldProps },
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
                  {...getFieldProps('rpcRemoteUrl', {
                    initialValue: rpcRemoteUrl,
                  })}
                  placeholder="请输入服务器地址"
                />
              </div>
              <div className="form-item">
                <label>接口匹配替换正则：</label>
                <input
                  type="text"
                  {...getFieldProps('rpcOperationTypeReg', {
                    initialValue: rpcOperationTypeReg,
                  })}
                  placeholder="请输入替换正则"
                />
              </div>
              <div className="form-item">
                <label>接口匹配替换字符串：</label>
                <input
                  type="text"
                  {...getFieldProps('rpcOperationTypeReplaceString', {
                    initialValue: rpcOperationTypeReplaceString,
                  })}
                  placeholder="请输入替换字符串"
                />
              </div>
              <div className="form-item">
                <label>登录接口名：</label>
                <input
                  type="text"
                  {...getFieldProps('rpcOperationLoginInterface', {
                    initialValue: rpcOperationLoginInterface,
                  })}
                  placeholder="请输入登录接口名"
                />
              </div>
              <div className="form-item">
                <label>登录成功码：</label>
                <input
                  type="text"
                  {...getFieldProps('rpcOperationLoginSuccessCode', {
                    initialValue: rpcOperationLoginSuccessCode,
                  })}
                  placeholder="请输入登录成功码"
                />
              </div>
              <div className="form-item">
                <label>登录结果码节点：</label>
                <input
                  type="text"
                  {...getFieldProps('rpcOperationLoginErrorCodePosition', {
                    initialValue: rpcOperationLoginErrorCodePosition,
                  })}
                  placeholder="请输入错误码数据节点"
                />
              </div>
              <div className="form-item">
                <label>错误信息节点：</label>
                <input
                  type="text"
                  {...getFieldProps('rpcOperationLoginErrorMsgPosition', {
                    initialValue: rpcOperationLoginErrorMsgPosition,
                  })}
                  placeholder="请输入错误码数据节点"
                />
              </div>
              <div className="form-item">
                <label>SessionID数据节点：</label>
                <input
                  type="text"
                  {...getFieldProps('rpcOperationSessionIDPosition', {
                    initialValue: rpcOperationSessionIDPosition,
                  })}
                  placeholder="请输入SessionID数据节点"
                />
              </div>
              <div className="form-item">
                <label>RPC请求报文配置：</label>
                <TextareaItem
                  placeholder="请输入RPC请求报文配置"
                  {...getFieldProps('rpcData', {
                    initialValue: stringifyObject(rpcData || {}, {
                      indent: '  ',
                    }),
                  })}
                  rows={6}
                  // autoHeight={true}
                />
              </div>
              <div className="form-item">
                <label>登录报文配置：</label>
                <TextareaItem
                  placeholder="请输入登录报文配置"
                  {...getFieldProps('rpcLogin', {
                    initialValue: stringifyObject(rpcLogin || {}, {
                      indent: '  ',
                    }),
                  })}
                  rows={6}
                  // autoHeight={true}
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

export default createForm()(SettingsView);
