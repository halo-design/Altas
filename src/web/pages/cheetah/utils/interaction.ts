import Toast from 'antd-mobile/lib/toast';

export default (command: string, params: any) => {
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
  }
};
