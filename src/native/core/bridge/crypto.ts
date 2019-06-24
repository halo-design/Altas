import * as hash from 'object-hash';
import * as crypto from '../../utils/crypto';

export default (RPC: any) => {
  const { dispatch } = RPC;

  RPC.on('aes-encode', (args: any) => {
    const mdString = hash.MD5(args.pswd);
    const key = mdString.slice(0, 16);
    const iv = mdString.slice(16);
    dispatch('get-aes-encode', crypto.aseEncode(args.data, key, iv));
  });

  RPC.on('aes-decode', (args: any) => {
    const mdString = hash.MD5(args.pswd);
    const key = mdString.slice(0, 16);
    const iv = mdString.slice(16);
    dispatch('get-aes-decode', crypto.aseDecode(args.data, key, iv));
  });
};
