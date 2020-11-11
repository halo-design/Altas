const getError = (action: string, xhr: any) => {
  let msg;
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to post ${action} ${xhr.status}`;
  }

  const err: any = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = action;
  return err;
};

const getBody = (xhr: any) => {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
};

export interface IUpload {
  action: string;
  onProgress?: (e: any) => void;
  onSuccess?: (e: any) => void;
  onError?: (e: any) => void;
  filename: string;
  file: any;
  withCredentials?: boolean;
  headers?: any;
}

export const upload = (option: IUpload): XMLHttpRequest => {
  const xhr = new XMLHttpRequest();
  const action = option.action;

  if (xhr.upload) {
    xhr.upload.onprogress = (e: any): void => {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100;
      }
      if (option.onProgress) {
        option.onProgress(e);
      }
    };
  }

  const formData = new FormData();

  formData.append(option.filename, option.file, option.file.name);

  xhr.onerror = (e: any): void => {
    if (option.onError) {
      option.onError(e);
    }
  };

  xhr.onload = (): any => {
    if ((xhr.status < 200 || xhr.status >= 300) && option.onError) {
      return option.onError(getError(action, xhr));
    } else if (option.onSuccess) {
      option.onSuccess(getBody(xhr));
      return null;
    }
  };

  xhr.open('post', action, true);

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  for (const item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      xhr.setRequestHeader(item, headers[item]);
    }
  }

  xhr.send(formData);
  return xhr;
};

export const getData = (url: string) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = (): any => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(getError(url, xhr));
      } else {
        resolve(getBody(xhr));
      }
    };

    xhr.open('get', url, true);
    xhr.send();
  });
};
