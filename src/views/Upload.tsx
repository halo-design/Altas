import { inject, observer } from 'mobx-react'
import * as React from 'react';

interface IProps {
  doUpload: () => void;
  getUploadHistory: () => void;
  clearUploadHistory: () => void;
  deleteUploadListStatusItem: (e: string) => void;
  getFileList: (node: HTMLInputElement) => void;
  postFiles: any[];
  uploadListStatus: object;
}

@inject((stores: any) => {
  const { upload: { postFiles, uploadListStatus } } = stores;
  return {
    clearUploadHistory: () => stores.upload.clearUploadHistory(),
    deleteUploadListStatusItem: (e: string) => stores.upload.deleteUploadListStatusItem(e),
    doUpload: () => stores.upload.doUpload(),
    getFileList: (node: HTMLInputElement) => stores.upload.getFileList(node),
    getUploadHistory: () => stores.upload.getUploadHistory(),
    postFiles,
    uploadListStatus,
  }
})

@observer
class UploadView extends React.Component<IProps> {
  private fileIpt: HTMLInputElement | null;

  public handleList = () => {
    if (this.fileIpt) {
      this.props.getFileList(this.fileIpt);
    }
  }

  public render() {
    const {
      clearUploadHistory,
      deleteUploadListStatusItem,
      doUpload,
      getUploadHistory,
      uploadListStatus,
      postFiles,
    } = this.props;
    const uids = Object.keys(uploadListStatus);

    return (
      <div>
        <br/>
        <br/>
        <input
          type="file"
          multiple={true}
          accept="image/*"
          name="smfile"
          ref={node => { this.fileIpt = node }}
          onChange={this.handleList}
          onDrop={this.handleList}
        />
        <button onClick={doUpload}>图片上传</button>
        <button onClick={getUploadHistory}>获取上传历史</button>
        <button onClick={clearUploadHistory}>清除上传历史</button>
        <div style={{ background: '#f4f4f4' }}>
        {
          postFiles.map((item, i) => {
            return (
              <div style={{ borderBottom: '1px solid #ccc', fontSize: '10px' }} key={i}>
                name: {item.name} <br/>
                path: {item.path} <br/>
                size: {item.size} <br/>
              </div>
            )
          })
        }
        </div>
        <div style={{ background: '#8aa7d2' }}>
        {
          uids.length > 0 && uids.map((uid) => {
            const item = uploadListStatus[uid];
            return (
              <div style={{ borderBottom: '1px solid #51637d', fontSize: '12px' }} key={uid}>
                name: {item.file.name} <br/>
                status: {item.status} <br/>
                progress: {item.progress ? item.progress.percent : 'error'} <br/>
                link: {item.remote ? <a href='#'>{item.remote.url}</a> : 'null' }
                <button onClick={e => { deleteUploadListStatusItem(uid) }}>删除</button>
              </div>
            )
          })
        }
        </div>
      </div>
    );
  }
}

export default UploadView;
