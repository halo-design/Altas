import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import Icon from 'antd/lib/icon';

import './index.scss';

@inject((stores: any) => {
  const {
    localServerRunStatus,
    createServerMonitorStatus,
  } = stores.createServer;

  return {
    localServerRunStatus,
    createServerMonitorStatus,
    disposeServer: () => stores.createServer.disposeServer(),
    restartServer: () => stores.createServer.restartServer(),
    copyAddress: () => stores.createServer.copyAddress(),
    setCreateServerDrawerVisible: (state: boolean) =>
      stores.createServer.setCreateServerDrawerVisible(state),
  };
})
@observer
class ServerMonitorView extends React.Component<any, any> {
  public startPozX: number = 0;
  public startPozY: number = 0;
  public moveX: number = 0;
  public moveY: number = 0;
  public minDistX: number = 72;
  public minDistY: number = 16;
  public moveable: boolean = false;
  public clientW: number = 0;
  public clientH: number = 0;
  public dragPozX: number = 0;
  public dragPozY: number = 0;

  constructor(Props: any) {
    super(Props);
    this.getClinetSize = this.getClinetSize.bind(this);
    this.mouseMoveHandle = this.mouseMoveHandle.bind(this);
    this.mouseUpHandle = this.mouseUpHandle.bind(this);
    this.state = {
      pozY: 0,
      pozX: 0,
    };
  }

  public getClinetSize() {
    const doc = document.documentElement;
    this.clientW = doc.clientWidth;
    this.clientH = doc.clientHeight;
  }

  public componentDidMount() {
    this.getClinetSize();
    this.setState({
      pozX: this.clientW / 2,
      pozY: this.minDistY + 10,
    });

    window.addEventListener('resize', this.getClinetSize, false);
    window.addEventListener('mousemove', this.mouseMoveHandle, false);
    window.addEventListener('mouseup', this.mouseUpHandle, false);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.getClinetSize);
    window.removeEventListener('mousemove', this.mouseMoveHandle);
    window.removeEventListener('mouseup', this.mouseUpHandle);
  }

  public mouseDownHandle(e: any) {
    this.moveable = true;
    this.startPozX = e.clientX;
    this.startPozY = e.clientY;
    this.dragPozX = this.state.pozX;
    this.dragPozY = this.state.pozY;
  }

  public limitX(num: number) {
    if (num < this.minDistX) {
      return this.minDistX;
    } else if (num > this.clientW - this.minDistX) {
      return this.clientW - this.minDistX;
    } else {
      return num;
    }
  }

  public limitY(num: number) {
    if (num < this.minDistY) {
      return this.minDistY;
    } else if (num > this.clientH - this.minDistY) {
      return this.clientH - this.minDistY;
    } else {
      return num;
    }
  }

  public mouseMoveHandle(e: any) {
    if (this.moveable) {
      this.moveX = e.clientX - this.startPozX;
      this.moveY = e.clientY - this.startPozY;

      this.setState({
        pozX: this.limitX(this.dragPozX + this.moveX),
        pozY: this.limitY(this.dragPozY + this.moveY),
      });
    }
  }

  public mouseUpHandle(e: any) {
    this.moveable = false;
    this.startPozX = 0;
    this.startPozY = 0;
  }

  public focusServerCreatePanel() {
    this.props.history.push('/tools');
    this.props.setCreateServerDrawerVisible(true);
  }

  public render() {
    const pozStyle = {
      left: this.state.pozX + 'px',
      top: this.state.pozY + 'px',
    };

    const {
      localServerRunStatus,
      createServerMonitorStatus,
      disposeServer,
      restartServer,
      copyAddress,
    } = this.props;

    return localServerRunStatus === 'on' &&
      createServerMonitorStatus === 'on' ? (
      <div className="app-server-monitor" style={pozStyle}>
        <div
          className="drag-btn"
          onMouseDown={(e: any) => {
            this.mouseDownHandle(e);
          }}
          onMouseUp={(e: any) => {
            this.mouseUpHandle(e);
          }}
        />
        <i
          className="iconfont info"
          title="查看详情"
          onClick={() => {
            this.focusServerCreatePanel();
          }}
        >
          &#xe774;
        </i>
        <i
          className="iconfont link"
          title="复制链接"
          onClick={() => {
            copyAddress();
          }}
        >
          <Icon type="link" style={{ fontSize: '16px' }} />
        </i>
        <i
          className="iconfont restart"
          title="重启服务"
          onClick={() => {
            restartServer();
          }}
        >
          &#xe651;
        </i>
        <i
          className="iconfont stop"
          title="结束服务"
          onClick={() => {
            disposeServer();
          }}
        >
          &#xe716;
        </i>
      </div>
    ) : (
      ''
    );
  }
}

export default withRouter(ServerMonitorView);
