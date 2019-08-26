const { execSync, spawnSync } = require('child_process');
import log from 'electron-log';

if (process.platform === 'darwin') {
  process.env.PATH = process.env.PATH + ':/usr/local/bin';
}

export const isMac = () => process.platform === 'darwin';
export const isWin = () => process.platform === 'win32';

export const cmdIsAvailable = (cmd: string) => {
  try {
    const outBuffer = execSync(cmd, { stdio: 'pipe' });
    const outText = outBuffer.toString('utf8').replace(/\n/g, '');
    log.info(outText);
    return outText;
  } catch (e) {
    return false;
  }
};

export const langIsAvailable = (cmd: string, argArr: string[]) => {
  try {
    const out = spawnSync(cmd, argArr, { stdio: 'pipe' });
    const outText = out.stderr.toString('utf8').replace(/\n/g, '');
    log.info(outText);
    return outText;
  } catch (e) {
    return false;
  }
};
