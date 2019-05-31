import RPC from './rpc';
const { dispatch } = RPC;

const messageBox = (args: object): void => {
  dispatch('on-dialog-message', { type: 'info', ...args });
};

export default messageBox;
