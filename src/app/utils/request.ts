import log from 'electron-log';
import * as https from 'https';

export default {
  getJSON(url: string) {
    return new Promise((resolve, reject) => {
      https.get(url, res => {
        const { statusCode } = res;
        if (statusCode !== 200) {
          log.error('文件请求失败！');
          reject(statusCode);
          res.resume();
        } else {
          res.setEncoding('utf8');

          let rawData = '';
          res.on('data', chunk => {
            rawData += chunk;
          });

          res
            .on('end', () => {
              resolve(JSON.parse(rawData));
            })
            .on('error', e => {
              reject(e);
            });
        }
      });
    });
  },
};
