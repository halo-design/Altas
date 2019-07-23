import * as React from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { selectFile } from '../../bridge/file';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import Select from 'antd/lib/select';
import * as clipBoard from '../../bridge/clipBoard';
import message from 'antd/lib/message';
import Tooltip from 'antd/lib/tooltip';
import { urlTest } from '../../constants/Reg';

const InputGroup = Input.Group;
const { Option } = Select;

import './index.scss';

@inject((stores: any) => {
  const {
    debugTool,
    protocol,
    projectDirectory,
    localHostNameList,
    localHostName,
    localHostPort,
    webServerHost,
    proxyTables,
  } = stores.createServer;

  return {
    debugTool,
    protocol,
    projectDirectory,
    localHostNameList,
    localHostName,
    localHostPort,
    webServerHost,
    proxyTables,
    setProjectDirectory: (str: string) =>
      stores.createServer.setProjectDirectory(str),
    setLocalHostName: (str: string) =>
      stores.createServer.setLocalHostName(str),
    setCreateServerMonitorStatus: (str: string) =>
      stores.createServer.setCreateServerMonitorStatus(str),
    setDebugTool: (str: string) => stores.createServer.setDebugTool(str),
    setLocalHostPort: (str: string) =>
      stores.createServer.setLocalHostPort(str),
    pushNewItemToProxyTables: (filter: string, host: string) =>
      stores.createServer.pushNewItemToProxyTables(filter, host),
    deleteItemFromProxyTables: (index: number) =>
      stores.createServer.deleteItemFromProxyTables(index),
  };
})
@observer
class CreateServerView extends React.Component<any> {
  @observable public focusAddProxyFilter: string = '';
  @observable public focusAddProxyHost: string = '';

  @action
  public clearFocusAddProxy() {
    this.focusAddProxyFilter = '';
    this.focusAddProxyHost = '';
  }

  @action
  public setFocusAddProxyFilter(str: string) {
    this.focusAddProxyFilter = str;
  }

  @action
  public setFocusAddProxyHost(str: string) {
    this.focusAddProxyHost = str;
  }

  public handleSelectDir() {
    const { setProjectDirectory } = this.props;
    selectFile(
      {
        message: '选择服务映射目录',
        properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
      },
      (res: string[] | undefined) => {
        if (res) {
          setProjectDirectory(res[0]);
        }
      }
    );
  }

  public copyAddress() {
    clipBoard.writeText(this.props.webServerHost);
    message.success('本地服务地址已复制到剪切板！');
  }

  public pushNewProxy() {
    if (
      this.focusAddProxyFilter.length > 0 &&
      (urlTest(this.focusAddProxyHost) ||
        this.focusAddProxyHost.indexOf('http://localhost') === 0)
    ) {
      this.props.pushNewItemToProxyTables(
        this.focusAddProxyFilter,
        this.focusAddProxyHost
      );
      this.clearFocusAddProxy();
    } else {
      message.warn('请输入正确的代理格式！');
    }
  }

  public createServerSubmit() {
    const { projectDirectory } = this.props;
    if (!projectDirectory) {
      message.warn('请选择服务映射目录！');
    }
  }

  public render() {
    const {
      debugTool,
      protocol,
      projectDirectory,
      localHostNameList,
      localHostName,
      setLocalHostName,
      setCreateServerMonitorStatus,
      setDebugTool,
      localHostPort,
      setLocalHostPort,
      proxyTables,
      deleteItemFromProxyTables,
    } = this.props;

    return (
      <div className="app-create-server">
        <div className="form-table server-create">
          <div className="form-item">
            <div className="label require">选择映射目录</div>
            <div className="form">
              <Input
                size="large"
                placeholder="点击选择服务映射目录"
                readOnly={true}
                value={projectDirectory}
                onClick={() => {
                  this.handleSelectDir();
                }}
                suffix={<Icon type="project" />}
              />
            </div>
          </div>
          <div className="form-item">
            <div className="label require">本地服务地址</div>
            <div className="form-item-row">
              <InputGroup size="large" compact={true}>
                <Input
                  style={{ width: '68px' }}
                  placeholder="protocol"
                  defaultValue={protocol + '://'}
                  disabled={true}
                />
                <Select
                  style={{ width: '214px' }}
                  defaultValue={localHostName}
                  size="large"
                  onChange={(val: string) => setLocalHostName(val)}
                >
                  {localHostNameList.map((item: string, index: number) => (
                    <Option value={item} key={index}>
                      {item}
                    </Option>
                  ))}
                </Select>
                <Input
                  style={{ width: '110px' }}
                  className="wrapper-input"
                  placeholder="端口"
                  defaultValue={localHostPort}
                  onChange={(e: any) => {
                    setLocalHostPort(e.target.value);
                  }}
                  addonAfter={
                    <Tooltip
                      placement="right"
                      title="点击复制地址"
                      mouseEnterDelay={1}
                    >
                      <Icon
                        type="link"
                        onClick={e => {
                          this.copyAddress();
                        }}
                      />
                    </Tooltip>
                  }
                />
              </InputGroup>
            </div>
          </div>
          <div className="form-item">
            <div className="label require">启动后打开方式</div>
            <div className="form-item-row">
              <InputGroup size="large" compact={true}>
                <Select
                  defaultValue={'on'}
                  size="large"
                  style={{ width: '30%' }}
                  onChange={(val: string) => setCreateServerMonitorStatus(val)}
                >
                  <Option value="on">启用悬浮框</Option>
                  <Option value="off">禁用悬浮框</Option>
                </Select>
                <Select
                  defaultValue={debugTool}
                  size="large"
                  style={{ width: '70%' }}
                  onChange={(val: string) => setDebugTool(val)}
                >
                  <Option value="none">不打开任何工具</Option>
                  <Option value="local">默认浏览器</Option>
                  <Option value="cheetah">猎豹App调试器</Option>
                  <Option value="web">Web应用调试器</Option>
                </Select>
              </InputGroup>
            </div>
          </div>
          {debugTool !== 'none' && projectDirectory.length > 0 && (
            <div className="form-item">
              <div className="label require">选择默认打开文件</div>
              <div className="form">
                <Input
                  size="large"
                  placeholder="点击选择默认打开文件"
                  value={''}
                  onClick={() => {
                    this.handleSelectDir();
                  }}
                  suffix={<Icon type="file" />}
                />
              </div>
            </div>
          )}
          <div className="form-item">
            <div className="label">请求代理转发</div>
            <div className="proxy-list">
              {proxyTables.map((item: any, index: number) => (
                <div className="form-item-row" key={index}>
                  <InputGroup size="large" compact={true}>
                    <Input
                      style={{ width: '40%' }}
                      placeholder="过滤请求路径"
                      value={item.filter}
                      prefix={<Icon type="filter" />}
                      readOnly={true}
                    />
                    <Input
                      style={{ width: '60%' }}
                      className="wrapper-input"
                      placeholder="代理服务地址"
                      value={item.host}
                      readOnly={true}
                      addonAfter={
                        <Tooltip placement="right" title="点击删除">
                          <Icon
                            type="delete"
                            onClick={e => {
                              deleteItemFromProxyTables(index);
                            }}
                          />
                        </Tooltip>
                      }
                      prefix={<Icon type="global" />}
                    />
                  </InputGroup>
                </div>
              ))}
            </div>
            <div className="form-item-row">
              <InputGroup size="large" compact={true}>
                <Input
                  style={{ width: '40%' }}
                  placeholder="过滤请求路径"
                  value={this.focusAddProxyFilter}
                  onChange={(e: any) => {
                    this.setFocusAddProxyFilter(e.target.value);
                  }}
                  prefix={<Icon type="filter" />}
                />
                <Input
                  style={{ width: '60%' }}
                  placeholder="代理服务地址"
                  className="wrapper-input"
                  value={this.focusAddProxyHost}
                  onChange={(e: any) => {
                    this.setFocusAddProxyHost(e.target.value);
                  }}
                  prefix={<Icon type="global" />}
                  addonAfter={
                    <Tooltip placement="right" title="点击添加">
                      <Icon
                        type="plus-circle"
                        onClick={e => {
                          this.pushNewProxy();
                        }}
                      />
                    </Tooltip>
                  }
                />
              </InputGroup>
            </div>
          </div>
          <div
            className="btn-large"
            onClick={() => {
              this.createServerSubmit();
            }}
          >
            启动本地服务器
          </div>
        </div>
      </div>
    );
  }
}

export default CreateServerView;
