import { action, computed, observable } from 'mobx';
import * as API from '../constants/API';
import { getData, upload } from '../utils/ajax';

export default class UploadModel {
  @observable public rawFiles: any[] = [];
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
    this.rawFiles = rawFiles;
  }

  @action
  public deleteRawFileById (uid: string): void {
    const tmpArr: any[] = [];
    this.rawFiles.forEach((file, i) => {
      if (file.uid !== uid) {
        tmpArr.push(file)
      }
    })
    this.rawFiles = tmpArr;
  }

  @computed
  get postFiles (): any[] {
    const baseType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

    return this.rawFiles.filter((file: any, index: number): boolean => {
      const uid = `${Date.now()}${index}`;
      file.uid = uid;

      const fileType = file.type.split('/')[1];
      if (baseType.indexOf(fileType) > -1) {
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
  }

  @computed
  get isXhrQueueEmpty (): boolean {
    if (Object.keys(this.xhrQueue).length > 0) {
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
  public deleteUploadListStatusItem (uid: string) {
    delete this.uploadListStatus[uid];
    if (this.xhrQueue[uid]) {
      this.xhrQueue[uid].abort();
      delete this.xhrQueue[uid];
      this.deleteRawFileById(uid);
    }
  }

  public deleteRemoteImage (token: string, onSuccess: (e: object) => void, onError: (e: any) => void) {
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
            this.rawFiles = [];
          }
        }
      });
    });
  }
}
