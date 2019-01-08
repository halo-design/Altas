import * as React from 'react';
import upload from '../utils/ajax';

class UploadView extends React.Component {
  private fileIpt: HTMLInputElement | null;
  private reqQueue: object = {};
  private postFiles: any[] = [];

  public handleList = () => {
    const baseType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
    const files = this.fileIpt ? this.fileIpt.files : [];
    let postFiles = Array.prototype.slice.call(files);
    postFiles = postFiles.filter((rawFile: any, index: number): boolean => {
      const fileType = rawFile.type.split('/')[1];
      if (baseType.indexOf(fileType) > -1) {
        const uid = `${Date.now()}${index}`;
        rawFile.uid = uid;
        return true;
      } else {
        return false;
      }
    });
    this.postFiles = postFiles;
    console.log(postFiles);
  }

  public handleUpload = () => {
    this.postFiles.forEach((rawFile: any, index: number) => {
      const uid = rawFile.uid;
      this.reqQueue[uid] = upload({
        action: 'https://sm.ms/api/upload?inajax=1&ssl=1',
        file: rawFile,
        filename: 'smfile',
        onProgress: (e) => {
          console.log(e);
        },
        onSuccess: (e) => {
          console.log(e);
          delete this.reqQueue[uid];
        }
      });
    });
  }

  public render() {
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
        <button onClick={this.handleUpload}>图片上传</button>
      </div>
    );
  }
}

export default UploadView;
