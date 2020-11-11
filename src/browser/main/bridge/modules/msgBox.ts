import RPC from '../rpc';
const { dispatch } = RPC;

const messageBox = (args: any): void => {
  dispatch('on-dialog-message', { type: 'info', ...args });
};

export default messageBox;
