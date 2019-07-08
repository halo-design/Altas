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
            sender(uid, { ok: false });
          },
        },
        {
          text: okText,
          onPress: () => {
            sender(uid, { ok: true });
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
              });
            },
          },
          {
            text: okText,
            onPress: (value: string) => {
              sender(uid, {
                ok: true,
                inputContent: value,
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
