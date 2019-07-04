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
    getRawFileList: (files: File[]) => {
      stores.upload.getRawFileList(files);
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
      okType: 'danger',
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
      okType: 'danger',
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
    clipBoard.writeText(txt);
    message.success('图片链接已复制到剪切板！');
  }

  public saveClipboardImage() {
    const img = clipBoard.readImage();
    if (!img.isEmpty()) {
      const file = new File([img.toPNG()], `screenshot-${Date.now()}.png`, {
        type: 'image/png',
      });
      file['url'] = img.resize({ width: 200, height: 200 }).toDataURL();
      file['thumbType'] = 'base64';
      console.log(file);
      this.props.getRawFileList([file]);
      message.success('粘贴成功！');
    }
  }

  public componentDidMount() {
    this.props.getLocalHistory();
    if (this.fileIpt) {
      const opts: any = [
        {
          // checked: true,
          click: (e: any) => {
            this.props.clearUploadHistory();
            message.success('清除成功！');
          },
          label: '清除服务器上传历史',
        },
        {
          type: 'separator',
        },
        {
          click: (e: any) => {
            this.saveClipboardImage();
          },
          label: '粘贴上传图片',
        },
      ];

      this.contextMenu = new CreateContextMenu(this.fileIpt, opts);
    }
  }

  public loadImage(el: any, url: string) {
    const temp = setTimeout(() => {
      if (!el.loaded) {
        el.src = url;
      }
      el.loaded = true;
      clearTimeout(temp);
    }, 300);
  }

  public loadImageError(el: any) {
    el.loaded = true;
    el.src = 'public/image.svg';
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
          onPaste={() => {
            this.saveClipboardImage();
          }}
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
            <span className="tit">点击、粘贴或拖拽至此处上传</span>
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
                <div>
                  <span>&#xe606;</span>
                  <span className="txt">点击开始上传</span>
                </div>
              )}
            </button>
          </div>
          <div className="upload-list">
            {uploadListStatusUids.length > 0 &&
              uploadListStatusUids.map(uid => {
                const item = uploadListStatus[uid];
                const { progress, file, status, remote } = item;

                const per = progress ? progress.percent : 0;
                const progressPercent = `${~~per}%`;

                return (
                  <div className="card-item" key={uid}>
                    <div className="inner">
                      <div className="row">
                        <div className="col filename">{file.name}</div>
                        <div className="progress">
                          <div className="percent">
                            已完成 {progressPercent}
                          </div>
                          <div className="surplus">
                            {prettyBytes((file.size * per) / 100)}
                            <span> / </span>
                            {prettyBytes(file.size)}
                          </div>
                        </div>
                      </div>
                      <div className="row status">
                        {status === 'ready' && (
                          <div className="info">准备上传</div>
                        )}
                        {status === 'error' && (
                          <div className="error">上传出错</div>
                        )}
                        {status === 'done' && [
                          <div className="col done" key="tit">
                            完成上传
                          </div>,
                          <div
                            key="copy"
                            className="copyBtn"
                            onClick={e => {
                              this.saveClipboard(remote.url);
                            }}
                          >
                            <Tooltip placement="bottom" title="复制图片链接">
                              <Icon type="copy" />
                              <span className="txt">复制链接</span>
                            </Tooltip>
                          </div>,
                        ]}
                        {status === 'pending' && (
                          <div className="progress-track">
                            <div
                              className="bar"
                              style={{ width: progressPercent }}
                            />
                          </div>
                        )}
                      </div>
                      <div
                        className="delBtn"
                        onClick={e => {
                          deleteUploadListStatusItem(uid, file.addIndex);
                        }}
                      >
                        <Tooltip placement="top" title="删除">
                          <Icon type="delete" />
                        </Tooltip>
                      </div>
                    </div>
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
                    <div className="card-item" key={index}>
                      <div className="inner">
                        <div className="row">
                          <div className="thumb">
                            <img
                              src="public/image.svg"
                              onLoad={e => {
                                this.loadImage(e.target, item.localThumb);
                              }}
                              onError={e => {
                                this.loadImageError(e.target);
                              }}
                              alt={item.filename}
                            />
                          </div>
                          <div className="col">
                            <div className="row filename">{item.filename}</div>
                            <div className="row surplus">
                              {prettyBytes(item.size)}
                            </div>
                            <div className="row">
                              <div className="col" />
                              <div
                                key="copy"
                                className="copyBtn"
                                onClick={e => {
                                  this.saveClipboard(item.url);
                                }}
                              >
                                <Tooltip
                                  placement="bottom"
                                  title="复制图片链接"
                                >
                                  <Icon type="copy" />
                                  <span className="txt">复制链接</span>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="delBtn"
                          onClick={e => {
                            deleteHistoryItem(index);
                          }}
                        >
                          <Tooltip placement="top" title="删除该条记录">
                            <Icon type="delete" />
                          </Tooltip>
                        </div>
                      </div>
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
                  <Tooltip placement="left" title="删除全部上传记录">
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
