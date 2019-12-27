import * as React from 'react';
import Tooltip from 'antd/lib/tooltip';
import { markdownViewer } from '../../bridge/modules/createWindow';

class PluginsView extends React.Component<any, any> {
  public render() {
    const pluginData = [
      {
        title: '倒计时插件',
        team: '杭州银行项目组',
        cover: 'https://api.pndtreats.com/v1/medias/5ca32a2b94c97a1f0041bd54',
        author: '柯银明',
        download: 12,
        like: 120,
        time: '2019/05/06',
        doc_lnk:
          'https://raw.githubusercontent.com/matteocrippa/awesome-swift/master/README.md',
        download_lnk: '',
      },
      {
        title: '轮播图组件',
        team: '青岛银行项目组',
        cover: 'https://images.ui8.net/uploads/artboard-7_1552727227502.png',
        author: '严琪',
        download: 5,
        like: 60,
        time: '2019/07/16',
        doc_lnk:
          'https://raw.githubusercontent.com/matteocrippa/awesome-swift/master/README.md',
        download_lnk: '',
      },
      {
        title: '自定义密码键盘',
        team: '重庆农商项目组',
        cover: 'https://images.ui8.net/uploads/2_1566846561158.png',
        author: '陈子帆',
        download: 15,
        like: 61,
        time: '2019/07/17',
        doc_lnk:
          'https://raw.githubusercontent.com/matteocrippa/awesome-swift/master/README.md',
        download_lnk: '',
      },
      {
        title: '银行卡管理组件',
        team: '广发项目组',
        cover: 'https://images.ui8.net/uploads/01_1565435719622.png',
        author: '刘龙森',
        download: 132,
        like: 320,
        time: '2019/07/18',
        doc_lnk:
          'https://raw.githubusercontent.com/matteocrippa/awesome-swift/master/README.md',
        download_lnk: '',
      },
      {
        title: '后台管理系统图表插件',
        team: '稠州银行项目组',
        cover: 'https://images.ui8.net/uploads/detail-img-2_1567857343288.jpg',
        author: '曹小杰',
        download: 16,
        like: 30,
        time: '2019/07/16',
        doc_lnk:
          'https://raw.githubusercontent.com/matteocrippa/awesome-swift/master/README.md',
        download_lnk: '',
      },
      {
        title: 'CRM管理系统插件合集',
        team: '郑州银行项目组',
        cover: 'https://images.ui8.net/uploads/artboard_1555690972664.png',
        author: '张坤',
        download: 282,
        like: 391,
        time: '2019/07/22',
        doc_lnk:
          'https://raw.githubusercontent.com/matteocrippa/awesome-swift/master/README.md',
        download_lnk: '',
      },
      {
        title: '移动端消息通知提示插件',
        team: '东莞银行项目组',
        cover: 'https://images.ui8.net/uploads/a_1530558920204.jpg',
        author: '赵榆',
        download: 45,
        like: 111,
        time: '2019/07/23',
        doc_lnk:
          'https://raw.githubusercontent.com/matteocrippa/awesome-swift/master/README.md',
        download_lnk: '',
      },
      {
        title: '移动端加载占位基础插件',
        team: '苏州银行项目组',
        cover: 'https://images.ui8.net/uploads/2_1525551198235.png',
        author: '李志明',
        download: 22,
        like: 92,
        time: '2019/07/23',
        doc_lnk:
          'https://raw.githubusercontent.com/matteocrippa/awesome-swift/master/README.md',
        download_lnk: '',
      },
    ];

    return (
      <div className="sub-page sub-page-plugins">
        <div className="content-list">
          {pluginData.map((item: any, index: number) => (
            <div className="item-card" key={index}>
              <div className="preview-cover">
                <img width="100%" height="100%" src={item.cover} alt="" />
              </div>
              <div className="info">
                <div className="title">{item.title}</div>
                <div className="author">
                  {item.team}-{item.author}
                </div>
                <div className="status">
                  <div className="itm download">
                    <Tooltip placement="top" title="下载次数">
                      <i className="iconfont">&#xe741;</i>
                    </Tooltip>
                    <span>{item.download}</span>
                  </div>
                  <div className="itm like">
                    <Tooltip placement="top" title="点赞次数">
                      <i className="iconfont">&#xe61a;</i>
                    </Tooltip>
                    <span>{item.like}</span>
                  </div>
                  <div className="itm time">
                    <Tooltip placement="top" title="上传时间">
                      <i className="iconfont">&#xe627;</i>
                    </Tooltip>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
              <div className="control-btn-wrap">
                <button
                  onClick={() => {
                    markdownViewer(item.doc_lnk);
                  }}
                >
                  查看文档
                </button>
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
