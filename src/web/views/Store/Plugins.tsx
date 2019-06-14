import * as React from 'react';
import Tooltip from 'antd/lib/tooltip';

class PluginsView extends React.Component<any, any> {
  public render() {
    return (
      <div className="sub-page sub-page-plugins">
        <div className="content-list">
          {Array(10)
            .fill('')
            .map((item, index) => (
              <div className="item-card" key={index}>
                <div className="preview-cover">
                  <img
                    width="100%"
                    height="100%"
                    src="https://api.pndtreats.com/v1/medias/5ca32a2b94c97a1f0041bd54"
                    alt=""
                  />
                </div>
                <div className="info">
                  <div className="title">倒计时插件</div>
                  <div className="author">杭银项目组-柯银明</div>
                  <div className="status">
                    <div className="itm download">
                      <Tooltip placement="top" title="下载次数">
                        <i className="iconfont">&#xe741;</i>
                      </Tooltip>
                      <span>12</span>
                    </div>
                    <div className="itm like">
                      <Tooltip placement="top" title="点赞次数">
                        <i className="iconfont">&#xe61a;</i>
                      </Tooltip>
                      <span>120</span>
                    </div>
                    <div className="itm time">
                      <Tooltip placement="top" title="上传时间">
                        <i className="iconfont">&#xe627;</i>
                      </Tooltip>
                      <span>2019/05/06</span>
                    </div>
                  </div>
                </div>
                <div className="control-btn-wrap">
                  <button>查看文档</button>
                  <button>下载使用</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default PluginsView;
