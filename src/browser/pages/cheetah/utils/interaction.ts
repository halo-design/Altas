import Toast from 'antd-mobile/lib/toast';
import Modal from 'antd-mobile/lib/modal';
import ActionSheet from 'antd-mobile/lib/action-sheet';
import { remote } from 'electron';
import * as clipBoard from '../../../main/bridge/modules/clipBoard';
import RPC from '../../../main/bridge/rpc';
const alert = Modal.alert;
const prompt = Modal.prompt;

export default (
  command: string,
  params: any,
  sender: Function,
  server: boolean,
  ws: boolean,
  mockData: any
) => {
  switch (command) {
    case 'showToastWithLoading': {
      const { content, duration, mask } = params;
      Toast.loading(content, duration, () => {}, mask);
      break;
    }

    case 'hideToast': {
      Toast.hide();
      break;
    }

    case 'showAlert': {
      const { title, content, cancelText, okText, uid } = params;
      alert(title, content, [
        {
          text: cancelText,
          onPress: () => {
            sender(uid, {
              ok: false,
              dismissByClickBg: false,
              error: '0',
              errorMessage: '',
            });
          },
        },
        {
          text: okText,
          onPress: () => {
            sender(uid, {
              ok: true,
              dismissByClickBg: false,
              error: '0',
              errorMessage: '',
            });
          },
        },
      ]);
      break;
    }

    case 'showPrompt': {
      const {
        title,
        content,
        cancelText,
        okText,
        defaultValue,
        placeholders,
        uid,
      } = params;
      prompt(
        title,
        content,
        [
          {
            text: cancelText,
            onPress: (value: string) => {
              sender(uid, {
                ok: false,
                inputContent: value,
                dismissByClickBg: false,
                error: '0',
                errorMessage: '',
              });
            },
          },
          {
            text: okText,
            onPress: (value: string) => {
              sender(uid, {
                ok: true,
                inputContent: value,
                dismissByClickBg: false,
                error: '0',
                errorMessage: '',
              });
            },
          },
        ],
        'default',
        defaultValue,
        [placeholders]
      );
      break;
    }

    case 'setStorage': {
      const { host, key, data } = params;
      localStorage.setItem(`${host}-${key}`, JSON.stringify({ data }));
      // console.log(host, key, data);
      break;
    }

    case 'getStorage': {
      const { host, key, uid } = params;
      const parseData =
        localStorage.getItem(`${host}-${key}`) ||
        JSON.stringify({ data: null });

      sender(uid, JSON.parse(parseData));
      break;
    }

    case 'setSessionStorage': {
      const { host, key, data } = params;
      sessionStorage.setItem(`${host}-${key}`, JSON.stringify({ data }));
      break;
    }

    case 'getSessionStorage': {
      const { host, key, uid } = params;
      const parseData =
        sessionStorage.getItem(`${host}-${key}`) ||
        JSON.stringify({ data: null });

      sender(uid, JSON.parse(parseData));
      break;
    }

    case 'showToast': {
      const { message, showIcon } = params;
      if (showIcon === '0') {
        Toast.fail(message);
      } else if (showIcon === '1') {
        Toast.success(message);
      } else {
        Toast.info(message);
      }
      break;
    }

    case 'showActionSheet': {
      const { title, items, uid } = params;
      items.push('取消');
      const lastIndex = items.length - 1;
      ActionSheet.showActionSheetWithOptions(
        {
          options: items,
          cancelButtonIndex: lastIndex,
          title,
        },
        (selectIndex: number) => {
          sender(uid, { selectIndex });
        }
      );
      break;
    }

    case 'copyToClipboard': {
      const { copyString } = params;
      clipBoard.writeText(copyString);
      Toast.success('已复制到剪切板！');
      break;
    }

    case 'openNativeWebBrowser': {
      const { url } = params;
      remote.shell.openExternal(url);
      break;
    }

    case 'remote-devtool': {
      RPC.mockProxyWsBrodcastGlobal(params);

      if (server) {
        ws
          ? Toast.info(
              `"${params.data.fnName}"方法被接管程序接管.`,
              3,
              () => {},
              false
            )
          : Toast.fail('请连接接管程序.', 3, () => {}, false);

        RPC.mockProxyWsRecieveGlobal(({ resCode, data, uid }: any) => {
          if (resCode === 200) {
            Toast.info('已进入接管模式！', 3, () => {}, false);
          }
          if (uid) {
            sender(uid, data);
          }
        });
      } else {
        const {
          data: { fnName },
          uid,
        } = params;
        if (fnName in mockData) {
          if (uid) {
            sender(uid, mockData[fnName]);
            Toast.info(`"${fnName}"方法返回缓存mock参数.`, 3, () => {}, false);
          }
        } else {
          Toast.fail(`"${fnName}"方法无mock参数返回.`, 3, () => {}, false);
        }
      }

      break;
    }
  }
};
