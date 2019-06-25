import * as fs from 'fs-extra';
import * as path from 'path';

const root = path.join(__dirname, '../');

export const saveFile = (filePath: string, fileDataBuffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const wstream = fs.createWriteStream(filePath);
    wstream.on('open', () => {
      const blockSize = 128;
      const nbBlocks = Math.ceil(fileDataBuffer.length / blockSize);
      for (let i = 0; i < nbBlocks; i += 1) {
        const currentBlock = fileDataBuffer.slice(
          blockSize * i,
          Math.min(blockSize * (i + 1), fileDataBuffer.length)
        );
        wstream.write(currentBlock);
      }
      wstream.end();
    });
    wstream.on('error', err => {
      reject(err);
    });
    wstream.on('finish', () => {
      resolve(true);
    });
  });
};

export const createDir = (dir: string, cb?: Function) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  cb && cb();
};

export default {
  read: (filename: string) => fs.readFileSync(filename, 'utf-8'),
  JSON2File: (fileName: string, data: object) => {
    const buf = Buffer.from(JSON.stringify(data, null, 2), 'utf8');
    saveFile(fileName, buf);
  },
  del: (filepath: string): void => {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  },
  exist: (filename: string): boolean =>
    fs.existsSync(path.join(root, filename)),
  file2JSON: (filePath: string): object =>
    JSON.parse(fs.readFileSync(path.join(root, filePath), 'utf-8')),
  path: (p: string): string => path.join(root, p),
  root,
  saveFile,
};
