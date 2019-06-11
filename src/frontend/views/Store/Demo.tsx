import * as React from 'react';
import Tooltip from 'antd/lib/tooltip';

class DemoView extends React.Component<any, any> {
  public render() {
    return (
      <div className="sub-page sub-page-demo">
        <div className="content-list">
          {Array(5)
            .fill('')
            .map((item, index) => (
              <div className="item-card" key={index}>
                <div className="preview-cover">
                  <img
                    width="100%"
                    height="100%"
                    src="https://img.zcool.cn/community/0141025a4308c8a8012197413b01d1.jpg@1280w_1l_2o_100sh.jpg"
                    alt=""
                  />
                </div>
                <div className="info">
                  <div className="title">圣诞大富翁专题H5</div>
                  <div className="author">移动业务条线-王欢</div>
                  <div className="status">
                    <div className="itm download">
                      <Tooltip placement="top" title="下载次数">
                        <i className="iconfont">&#xe741;</i>
                      </Tooltip>
                      <span>550</span>
                    </div>
                    <div className="itm like">
                      <Tooltip placement="top" title="点赞次数">
                        <i className="iconfont">&#xe61a;</i>
                      </Tooltip>
                      <span>393</span>
                    </div>
                    <div className="itm time">
                      <Tooltip placement="top" title="上传时间">
                        <i className="iconfont">&#xe627;</i>
                      </Tooltip>
                      <span>2018/12/06</span>
                    </div>
                  </div>
                </div>
                <div className="control-btn-wrap">
                  <button>查看文档</button>
                  <button>下载源码</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default DemoView;
