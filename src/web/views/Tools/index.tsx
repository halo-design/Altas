import * as React from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Drawer from 'antd/lib/drawer';
import Upload from '../../layouts/Upload';
import {
  openDeviceDebug,
  openCheetahDebug,
  openMarkdownPreview,
} from '../../bridge/createWindow';
import { allDeviceObject } from '../../config/DeviceDescriptors';

import './index.scss';

@inject((stores: any) => {
  const {
    terminal: { useDebugDevice },
  } = stores;

  return {
    useDebugDevice,
    setMonitorVisible: (state: boolean) =>
      stores.workStation.setMonitorVisible(state),
  };
})
@observer
class ToolsView extends React.Component<any> {
  @observable public uploadDrawerVisible: boolean = false;

  @action
  public handleUploadDrawerVisible(state: boolean): void {
    this.uploadDrawerVisible = state;
  }

  public openDebugDevice() {
    openDeviceDebug({
      target: 'https://mobile.ant.design/kitchen-sink/',
      // preload: './public/devtools-inject.js',
      descriptors: allDeviceObject[this.props.useDebugDevice],
      insertCSS: `
          body::-webkit-scrollbar {
            width: 4px;
          }
          
          body::-webkit-scrollbar-thumb {
            background-color: rgb(220, 220, 220);
          }
          
          body::-webkit-scrollbar-track-piece {
            background-color: transparent;
          }
        `,
    });
  }

  public openCheetahDevice() {
    openCheetahDebug({
      target: 'https://mobile.ant.design/kitchen-sink/',
      preload: './public/devtools-inject.js',
      descriptors: allDeviceObject[this.props.useDebugDevice],
    });
  }

  public componentDidMount() {
    this.props.setMonitorVisible(false);
  }

  public componentWillUnmount() {
    this.props.setMonitorVisible(true);
  }

  public render() {
    return (
      <div className="page-tools">
        <h1 className="title">常用工具</h1>
        <div className="tools-list">
          <div
            className="item"
            onClick={e => {
              this.openDebugDevice();
            }}
          >
            <i className="debug" />
            <div className="tit">Web应用调试器</div>
          </div>
          <div
            className="item"
            onClick={e => {
              this.openCheetahDevice();
            }}
          >
            <i className="cheetah" />
            <div className="tit">猎豹App调试器</div>
          </div>
          <div
            className="item"
            onClick={e => {
              openMarkdownPreview();
            }}
          >
            <i className="markdown" />
            <div className="tit">MD文档预览</div>
          </div>
          <div
            className="item"
            onClick={e => {
              this.handleUploadDrawerVisible(true);
            }}
          >
            <i className="imgupload" />
            <div className="tit">图片图床</div>
          </div>
          <div
            className="item"
            onClick={e => {
              // this.handleUploadDrawerVisible(true);
            }}
          >
            <i className="server" />
            <div className="tit">模拟本地服务</div>
          </div>
          <div
            className="item"
            onClick={e => {
              // this.handleUploadDrawerVisible(true);
            }}
          >
            <i className="zip" />
            <div className="tit">ZIP文件压缩</div>
          </div>
          <div
            className="item"
            onClick={e => {
              // this.handleUploadDrawerVisible(true);
            }}
          >
            <i className="calculator" />
            <div className="tit">计算文件MD5</div>
          </div>
        </div>
        <Drawer
          title="图片图床"
          placement="right"
          closable={true}
          width={420}
          onClose={() => {
            this.handleUploadDrawerVisible(false);
          }}
          visible={this.uploadDrawerVisible}
        >
          <Upload />
        </Drawer>
      </div>
    );
  }
}

export default ToolsView;
