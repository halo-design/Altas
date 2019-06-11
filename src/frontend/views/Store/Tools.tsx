import * as React from 'react';
import Tooltip from 'antd/lib/tooltip';

class ToolsView extends React.Component<any, any> {
  public render() {
    return (
      <div className="sub-page sub-page-demo">
        <div className="content-list">
          {Array(6)
            .fill('')
            .map((item, index) => (
              <div className="item-card" key={index}>
                <div className="preview-cover">
                  <img
                    width="100%"
                    height="100%"
                    src="https://static.collectui.com/shots/4355094/trail-forks-i-os-app-large"
                    alt=""
                  />
                </div>
                <div className="info">
                  <div className="title">安卓webview在线调试工具</div>
                  <div className="author">移动业务条线-高猛</div>
                  <div className="status">
                    <div className="itm download">
                      <Tooltip placement="top" title="下载次数">
                        <i className="iconfont">&#xe741;</i>
                      </Tooltip>
                      <span>210</span>
                    </div>
                    <div className="itm like">
                      <Tooltip placement="top" title="点赞次数">
                        <i className="iconfont">&#xe61a;</i>
                      </Tooltip>
                      <span>223</span>
                    </div>
                    <div className="itm time">
                      <Tooltip placement="top" title="上传时间">
                        <i className="iconfont">&#xe627;</i>
                      </Tooltip>
                      <span>2019/04/06</span>
                    </div>
                  </div>
                </div>
                <div className="control-btn-wrap">
                  <button>查看文档</button>
                  <button>下载工具</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default ToolsView;
