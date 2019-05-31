const { execSync, spawnSync } = require('child_process');

export const cmdIsAvailable = (cmd: string) => {
  try {
    const outBuffer = execSync(cmd, { stdio: 'pipe' });
    return outBuffer.toString('utf8').replace(/\n/g, '');
  } catch (e) {
    return false;
  }
};

export const langIsAvailable = (cmd: string, argArr: string[]) => {
  try {
    const out = spawnSync(cmd, argArr, { stdio: 'pipe' });
    return out.stderr.toString('utf8').replace(/\n/g, '');
  } catch (e) {
    return false;
  }
};

export const supportEnv = () => {
  const es = {
    node: cmdIsAvailable('node -v'),
    npm: cmdIsAvailable('npm -v'),
    vue: cmdIsAvailable('vue -V'),
    yarn: cmdIsAvailable('yarn -v'),
    python: langIsAvailable('python', ['-V']),
  };

  return es;
};
