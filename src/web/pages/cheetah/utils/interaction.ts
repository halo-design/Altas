import Toast from 'antd-mobile/lib/toast';
import Modal from 'antd-mobile/lib/modal';
const alert = Modal.alert;
const prompt = Modal.prompt;

export default (command: string, params: any, sender: Function) => {
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
  }
};
