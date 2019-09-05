import Axios from 'axios';
import Toast from 'antd-mobile/lib/toast';

export interface IRpcConfig {
  rpcRemoteUrl: string;
  rpcOperationTypeReg: string;
  rpcOperationTypeReplaceString: string;
}

export const cheetahRpc = (
  config: IRpcConfig,
  options: {
    operationType: string;
    requestData: Object[];
    headers?: Object;
    timeout?: any;
  },
  bridgeCallback: Function,
  overwriteData?: Object,
  overwriteReq?: Object
) => {
  const {
    rpcRemoteUrl,
    rpcOperationTypeReg,
    rpcOperationTypeReplaceString,
  } = config;

  const rpcInterface = (options.operationType || '').replace(
    new RegExp(rpcOperationTypeReg, 'g'),
    rpcOperationTypeReplaceString
  );

  const rpcRequestBody =
    ((options.requestData || [])[0] || {})['_requestBody'] || {};

  const requester = Axios.create({
    baseURL: rpcRemoteUrl,
    headers: options.headers || {},
    timeout: (options.timeout ? Number(options.timeout) : 20) * 1000,
  });

  requester.interceptors.request.use((req: any) => {
    if (overwriteData) {
      req.data = {
        ...req.data,
        ...overwriteData,
      };
    }

    if (overwriteReq) {
      req.data = {
        ...req.data,
        ...overwriteReq,
      };
    }

    console.log('[REQ]', req);
    return req;
  });

  requester.interceptors.response.use((res: any) => {
    console.log('[RES]', res);
    return res;
  });

  const callback = (res: any) => {
    if (!res) {
      Toast.fail('网络错误');
      return;
    }
    const { status, statusText, data } = res;
    const statusCode = String(status);
    const statusMessage = statusText || '';

    bridgeCallback({
      error: statusCode.charAt(0) == '2' ? '0' : statusCode,
      errorMessage: statusMessage,
      resData: data,
    });
  };

  requester.post(rpcInterface, rpcRequestBody).then(callback, (err: any) => {
    callback(err.response);
  });
};
