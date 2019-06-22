import { inject, observer } from 'mobx-react';
import { action, observable } from 'mobx';
import classNames from 'classnames';
import * as React from 'react';
import * as clipBoard from '../../bridge/clipBoard';
import Tooltip from 'antd/lib/tooltip';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import CreateContextMenu from '../../bridge/CreateContextMenu';
import Modal from 'antd/lib/modal';
const prettyBytes = require('pretty-bytes');

const { confirm } = Modal;

import './index.scss';

@inject((stores: any) => {
  const {
    upload: {
      uploadListStatus,
      uploadHistoryList,
      isXhrQueueEmpty,
      isAllEmpty,
    },
  } = stores;
  return {
    resetData: () => {
      stores.upload.resetData();
    },
    getLocalHistory: () => {
      stores.upload.getLocalHistory();
    },
    clearUploadHistory: () => {
      stores.upload.clearUploadHistory();
    },
    deleteUploadListStatusItem: (e: string, i: number) => {
      stores.upload.deleteUploadListStatusItem(e, i);
    },
    doUpload: () => stores.upload.doUpload(),
    getFileList: (node: HTMLInputElement) => {
      stores.upload.getFileList(node);
    },
    getUploadHistory: () => {
      stores.upload.getUploadHistory();
    },
    deleteAllHistory: () => {
      stores.upload.deleteAllHistory();
    },
    deleteHistoryItem: (order: number) => {
      stores.upload.deleteHistoryItem(order);
    },
    uploadListStatus,
    uploadHistoryList,
    isXhrQueueEmpty,
    isAllEmpty,
  };
})
@observer
class UploadView extends React.Component<any> {
  private fileIpt: HTMLInputElement | null = null;
  private fileIptBtn: HTMLInputElement | null = null;
  public contextMenu: any = null;

  @observable showSectionIndex: number = 0;

  @action
  public handleSectionIndex(num: number) {
    this.showSectionIndex = num;
  }

  public handleClearData() {
    if (this.props.isAllEmpty) {
      return;
    }
    confirm({
      title: '清除上传',
      content: '是否清除全部上传？',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        this.props.resetData();
      },
      onCancel: () => {},
    });
  }

  public handleClearAllHistory() {
    if (this.props.uploadHistoryList.length === 0) {
      return;
    }
    confirm({
      title: '清除上传',
      content: '该操作不可撤销，是否清除全部上传记录？',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        this.props.deleteAllHistory();
      },
      onCancel: () => {},
    });
  }

  public handleList = () => {
    if (this.fileIpt) {
      this.props.getFileList(this.fileIpt);
    }
  };

  public handleBtnList = () => {
    if (this.fileIptBtn) {
      this.props.getFileList(this.fileIptBtn);
    }
  };

  public saveClipboard(txt: string) {
    clipBoard.write(txt);
    message.success('图片链接已复制到剪切板！');
  }

  public componentDidMount() {
    this.props.getLocalHistory();
    if (this.fileIpt) {
      this.contextMenu = new CreateContextMenu(this.fileIpt, [
        {
          click: () => {
            this.props.getUploadHistory();
          },
          label: '获取上传记录',
        },
        {
          type: 'separator',
        },
        {
          checked: true,
          click: (e: any) => {
            this.props.clearUploadHistory();
          },
          label: '清除上传历史',
        },
      ]);
    }
  }

  public componentWillUnmount() {
    this.contextMenu.unbind();
  }

  public render() {
    const {
      deleteUploadListStatusItem,
      deleteHistoryItem,
      uploadHistoryList,
      doUpload,
      uploadListStatus,
      isXhrQueueEmpty,
      isAllEmpty,
    } = this.props;

    const uploadListStatusUids = Object.keys(uploadListStatus);

    return (
      <div className="app-upload">
        <div className="app-switch">
          <div
            className={classNames('item-btn', {
              active: this.showSectionIndex === 0,
            })}
            onClick={() => {
              this.handleSectionIndex(0);
            }}
          >
            上传文件
          </div>
          <div
            className={classNames('item-btn', {
              active: this.showSectionIndex === 1,
            })}
            onClick={() => {
              this.handleSectionIndex(1);
            }}
          >
            上传记录
          </div>
        </div>
        <div
          className={classNames('upload-section', {
            hide: this.showSectionIndex !== 0,
          })}
        >
          <div className={classNames('upload-btn', { hide: !isAllEmpty })}>
            <input
              type="file"
              multiple={true}
              accept="image/gif,image/jpeg,image/jpg,image/png,image/bmp,image/png"
              name="smfile"
              ref={node => {
                this.fileIpt = node;
              }}
              onChange={this.handleList}
              onDrop={this.handleList}
            />
            <span className="tit">点击或拖拽至此处上传</span>
          </div>
          <div className="control-panel">
            <Tooltip placement="top" title="选择上传图片">
              <button
                className={classNames('iconfont', 'btn', {
                  disabled: !isXhrQueueEmpty,
                  red: isXhrQueueEmpty,
                })}
              >
                <span>&#xe754;</span>
                <input
                  type="file"
                  multiple={true}
                  accept="image/gif,image/jpeg,image/jpg,image/png,image/bmp,image/png"
                  name="smfile"
                  ref={node => {
                    this.fileIptBtn = node;
                  }}
                  className={classNames({
                    hide: !isXhrQueueEmpty,
                  })}
                  onChange={this.handleBtnList}
                  onDrop={this.handleBtnList}
                />
              </button>
            </Tooltip>
            <button
              onClick={() => {
                this.handleClearData();
              }}
              className={classNames('iconfont', 'btn', {
                disabled: isAllEmpty,
              })}
            >
              <Tooltip placement="top" title="删除上传记录">
                &#xe601;
              </Tooltip>
            </button>
            <button
              className={classNames('iconfont', 'btn', {
                yellow: !isXhrQueueEmpty,
                blue: isXhrQueueEmpty,
              })}
              onClick={doUpload}
            >
              {!isXhrQueueEmpty ? (
                <Tooltip placement="top" title="正在上传">
                  <Icon type="loading" />
                </Tooltip>
              ) : (
                <Tooltip placement="top" title="点击开始上传">
                  &#xe606;
                </Tooltip>
              )}
            </button>
          </div>
          <div style={{ background: '#8aa7d2' }}>
            {uploadListStatusUids.length > 0 &&
              uploadListStatusUids.map(uid => {
                const item = uploadListStatus[uid];
                return (
                  <div
                    style={{
                      borderBottom: '1px solid #51637d',
                      fontSize: '12px',
                    }}
                    key={uid}
                  >
                    path: {item.file.path} <br />
                    size: {prettyBytes(item.file.size)} <br />
                    name: {item.filename} <br />
                    status: {item.status} <br />
                    progress: {item.progress ? item.progress.percent : '0'}{' '}
                    <br />
                    link:{' '}
                    {item.remote ? (
                      <button
                        onClick={e => {
                          this.saveClipboard(item.remote.url);
                        }}
                      >
                        🔗点击复制链接
                      </button>
                    ) : (
                      'null'
                    )}
                    <button
                      onClick={e => {
                        deleteUploadListStatusItem(uid, item.file.addIndex);
                      }}
                    >
                      删除
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className={classNames('history-section', {
            hide: this.showSectionIndex !== 1,
          })}
        >
          {uploadHistoryList.length > 0 ? (
            <div className="upload-content">
              <div className="upload-list">
                {uploadHistoryList.map((item: any, index: number) => {
                  return (
                    <div
                      style={{
                        borderBottom: '1px solid #51637d',
                        fontSize: '12px',
                      }}
                      key={index}
                    >
                      name: {item.filename} <br />
                      size: {prettyBytes(item.size)} <br />
                      link:{item.url}
                      <button
                        onClick={e => {
                          deleteHistoryItem(index);
                        }}
                      >
                        删除该条记录
                      </button>
                      <button
                        onClick={e => {
                          this.saveClipboard(item.url);
                        }}
                      >
                        🔗点击复制链接
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="control-panel">
                <button
                  onClick={() => {
                    this.handleClearAllHistory();
                  }}
                  className="iconfont btn"
                >
                  <Tooltip placement="top" title="删除全部上传记录">
                    &#xe601;
                  </Tooltip>
                </button>
              </div>
            </div>
          ) : (
            <div className="no-result" data-info="暂无上传记录" />
          )}
        </div>
      </div>
    );
  }
}

export default UploadView;
