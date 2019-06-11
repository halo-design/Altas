import * as React from 'react';
import Tooltip from 'antd/lib/tooltip';

class UIView extends React.Component<any, any> {
  public render() {
    return (
      <div className="sub-page sub-page-demo">
        <div className="content-list">
          {Array(3)
            .fill('')
            .map((item, index) => (
              <div className="item-card" key={index}>
                <div className="preview-cover">
                  <img
                    width="100%"
                    height="100%"
                    src="https://static.collectui.com/shots/4394601/trading-system-product-introduction-large"
                    alt=""
                  />
                </div>
                <div className="info">
                  <div className="title">ynet UI库</div>
                  <div className="author">移动业务条线-王欢</div>
                  <div className="status">
                    <div className="itm download">
                      <Tooltip placement="top" title="下载次数">
                        <i className="iconfont">&#xe741;</i>
                      </Tooltip>
                      <span>350</span>
                    </div>
                    <div className="itm like">
                      <Tooltip placement="top" title="点赞次数">
                        <i className="iconfont">&#xe61a;</i>
                      </Tooltip>
                      <span>471</span>
                    </div>
                    <div className="itm time">
                      <Tooltip placement="top" title="上传时间">
                        <i className="iconfont">&#xe627;</i>
                      </Tooltip>
                      <span>2019/06/06</span>
                    </div>
                  </div>
                </div>
                <div className="control-btn-wrap">
                  <button>查看文档</button>
                  <button>安装使用</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default UIView;
