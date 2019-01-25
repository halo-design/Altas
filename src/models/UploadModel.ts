import { action, computed, observable } from 'mobx';
import * as API from '../constants/API';
import { getData, upload } from '../utils/ajax';
import { setTrayTitle } from '../utils/bridge';

export default class UploadModel {
  @observable public postFiles: any[] = [];
  @observable public xhrQueue: object = {};
  @observable public uploadListStatus: object = {};
  @observable public remoteImageArray: any[] = [];
  
  @action
  public getFileList = (node: HTMLInputElement) => {
    if (!this.isXhrQueueEmpty) {
      return
    }
  
    const files = node.files;
    const rawFiles = Array.prototype.slice.call(files);

    const baseType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

    const addFiles = rawFiles.filter((file: any, index: number): boolean => {
      const fileType = file.type.split('/')[1];
      if (baseType.indexOf(fileType) > -1) {
        const uid = `${Date.now()}${index}`;
        file.uid = uid;
        file.addIndex = index;

        this.uploadListStatus[uid] = {
          file,
          progress: null,
          remote: null,
          status: 'ready',
        };

        return true;
      } else {
        return false;
      }
    });

    this.postFiles = this.postFiles.concat(addFiles);
  }

  @action
  public deletePostFile (index: number): void {
    delete this.postFiles[index];
  }

  @computed
  get isXhrQueueEmpty (): boolean {
    const num = Object.keys(this.xhrQueue).length;
    if (num > 0) {
      console.log('上传队列尚未完成！')
      return false
    } else {
      return true
    }
  }

  public getUploadHistory () {
    getData(API.uploadHistory)
      .then((param) => {
        console.log(param)
      })
  }

  public clearUploadHistory () {
    getData(API.clearUploadHistory)
      .then((param) => {
        console.log(param)
      })
  }

  @action
  public deleteUploadListStatusItem (uid: string, addIndex: number) {
    delete this.uploadListStatus[uid];
    if (this.xhrQueue[uid]) {
      this.xhrQueue[uid].abort();
      delete this.xhrQueue[uid];
    }
    this.deletePostFile(addIndex);
  }

  public deleteRemoteImage (
    token: string,
    onSuccess: (e: object) => void,
    onError: (e: any) => void
  ) {
    getData(token)
      .then((param) => {
        onSuccess(param);
      })
      .catch((e) => {
        onError(e);
      })
  }

  @action
  public abort (uid?: string) {
    if (uid) {
      this.xhrQueue[uid].abort();
    } else {
      Object.keys(this.xhrQueue).forEach((id: string) => {
        this.xhrQueue[id].abort();
        delete this.xhrQueue[id];
      });
    }
  }

  @action
  public doUpload = () => {
    if (!this.isXhrQueueEmpty) {
      return
    }
    setTrayTitle(this.postFiles.length.toString());
    this.postFiles.forEach((file: any, index: number) => {
      const uid = file.uid;
      this.xhrQueue[uid] = upload({
        action: API.upload,
        file,
        filename: 'smfile',
        onError: () => {
          this.uploadListStatus[uid].status = 'error';
          delete this.xhrQueue[uid];
        },
        onProgress: (e) => {
          const itemStatus = this.uploadListStatus[uid];
          if (itemStatus) {
            itemStatus.progress = e;
            itemStatus.status = 'pending';
          }
        },
        onSuccess: (e) => {
          const itemStatus = this.uploadListStatus[uid];
          if (itemStatus) {
            itemStatus.status = 'done';
            itemStatus.remote = e.data;
          }
          this.remoteImageArray.push(e.data);
          delete this.xhrQueue[uid];
          if (this.isXhrQueueEmpty) {
            setTrayTitle('');
            this.postFiles = [];
          }
        }
      });
    });
  }
}
