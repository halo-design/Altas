import { action, computed, observable } from 'mobx';
import * as API from '../constants/API';
import { getData, upload } from '../utils/ajax';
import message from 'antd/lib/message';
import * as storage from '../bridge/storage';
import { removeFile } from '../bridge/file';
import { createCache } from '../bridge/createImageCache';
import { appCacheFullPath } from '../constants/API';
import * as uuid from 'uuid';
import * as path from 'path';

export default class UploadModel {
  @observable public postFiles: any[] = [];
  @observable public xhrQueue: object = {};
  @observable public uploadListStatus: object = {};
  @observable public uploadHistoryList: any[] = [];
  @observable public remoteImageArray: any[] = [];
  public readLocal: boolean = false;

  public writeLocalHistory() {
    storage.write('upload_image_history', {
      upload_image_history: this.uploadHistoryList,
    });
  }

  @action
  public getLocalHistory() {
    if (this.readLocal) {
      return;
    }
    this.readLocal = true;
    storage.read('upload_image_history', (data: any) => {
      let { upload_image_history } = data;
      if (upload_image_history) {
        upload_image_history = Object.keys(upload_image_history).map(
          (key: any) => upload_image_history[key]
        );
        // console.log(upload_image_history);
        this.uploadHistoryList = upload_image_history;
      }
    });
  }

  @action
  public deleteHistoryItem(order: number) {
    const item = this.uploadHistoryList[order];
    removeFile(item.localThumb);
    getData(item.delete)
      .then(param => {
        console.log(param);
      })
      .catch(() => {
        message.error('图片服务端删除失败！');
      });

    this.uploadHistoryList = this.uploadHistoryList.filter(
      (item: any, index: number) => index !== order
    );
    this.writeLocalHistory();
  }

  @action
  public deleteAllHistory() {
    this.uploadHistoryList.map((item: any) => {
      removeFile(item.localThumb);
      getData(item.delete)
        .then(param => {
          console.log(param);
        })
        .catch(() => {
          message.error('图片服务端删除失败！');
        });
    });
    this.uploadHistoryList = [];
    this.writeLocalHistory();
  }

  @action
  public resetData() {
    if (!this.isXhrQueueEmpty) {
      message.warn('上传队列尚未完成！');
      return false;
    } else {
      this.postFiles = [];
      this.xhrQueue = {};
      this.uploadListStatus = {};
      return true;
    }
  }

  @action
  public getFileList(node: HTMLInputElement) {
    const files = node.files;
    const rawFiles = Array.prototype.slice.call(files);
    this.getRawFileList(rawFiles);
    node.value = '';
  }

  @action
  public getRawFileList(rawFiles: File[]) {
    if (!this.isXhrQueueEmpty) {
      return;
    }

    const baseType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

    const addFiles = rawFiles.filter((file: any, index: number): boolean => {
      const fileType = file.type.split('/')[1];
      if (baseType.indexOf(fileType) > -1 && file.size <= 4 * Math.pow(2, 20)) {
        const uid = uuid.v4();
        file.uid = uid;
        file.addIndex = index;
        if (!file.thumbType) {
          file.thumbType = 'image';
        }

        this.uploadListStatus[uid] = {
          file,
          progress: null,
          remote: null,
          status: 'ready',
        };

        return true;
      } else {
        message.error('文件格式或大小错误（不得超过4MB）！');
        return false;
      }
    });

    this.postFiles = this.postFiles.concat(addFiles);
  }

  @action
  public deletePostFile(index: number): void {
    delete this.postFiles[index];
  }

  @computed
  get isAllEmpty(): boolean {
    const upNum = Object.keys(this.uploadListStatus).length;
    const xhrNum = Object.keys(this.xhrQueue).length;
    return upNum + xhrNum === 0;
  }

  @computed
  get isXhrQueueEmpty(): boolean {
    const num = Object.keys(this.xhrQueue).length;
    if (num > 0) {
      return false;
    } else {
      return true;
    }
  }

  public getUploadHistory() {
    getData(API.uploadHistory).then(param => {
      console.log(param);
    });
  }

  public clearUploadHistory() {
    getData(API.clearUploadHistory).then(param => {
      message.success('上传历史清除成功！');
      console.log(param);
    });
  }

  @action
  public deleteUploadListStatusItem(uid: string, addIndex: number) {
    delete this.uploadListStatus[uid];
    if (this.xhrQueue[uid]) {
      this.xhrQueue[uid].abort();
      delete this.xhrQueue[uid];
    }
    this.deletePostFile(addIndex);
  }

  public deleteRemoteImage(
    token: string,
    onSuccess: (e: object) => void,
    onError: (e: any) => void
  ) {
    getData(token)
      .then((param: any) => {
        onSuccess(param);
      })
      .catch(e => {
        onError(e);
      });
  }

  @action
  public abort(uid?: string) {
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
      message.warn('上传队列尚未完成！');
      return;
    }

    if (this.postFiles.length === 0) {
      message.info('请选择上传图片文件！');
    }

    this.postFiles.forEach((file: any, index: number) => {
      if (!file) {
        return;
      }
      const uid = file.uid;
      this.xhrQueue[uid] = upload({
        action: API.upload,
        file,
        filename: 'smfile',
        onError: () => {
          this.uploadListStatus[uid].status = 'error';
          delete this.xhrQueue[uid];
        },
        onProgress: e => {
          const itemStatus = this.uploadListStatus[uid];
          if (itemStatus) {
            itemStatus.progress = e;
            itemStatus.status = 'pending';
          }
        },
        onSuccess: ({ code, data }: any) => {
          if (code === 'success') {
            const itemStatus = this.uploadListStatus[uid];
            if (itemStatus) {
              itemStatus.status = 'done';
              itemStatus.remote = data;
              itemStatus.remote.uid = uid;
              itemStatus.remote.localThumb = path.join(
                appCacheFullPath,
                uid + '.png'
              );
            }
            this.remoteImageArray.push(data);
            createCache({
              url: file.url,
              thumbType: file['thumbType'],
              saveName: uid + '.png',
              width: 200,
              height: 200,
            });
            delete this.xhrQueue[uid];
            this.uploadHistoryList.push(itemStatus.remote);
            delete this.postFiles[index];
            this.writeLocalHistory();
            if (this.isXhrQueueEmpty) {
              this.postFiles = [];
            }
          } else {
            this.uploadListStatus[uid].status = 'error';
            delete this.xhrQueue[uid];
          }
        },
      });
    });
  };
}
