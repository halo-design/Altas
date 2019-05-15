const log = require('electron-log');
const { buildInfoFilePath, ssh } = require('./utils');
const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');

const auth = yaml.parse(
  fs.readFileSync(path.join(__dirname, '../keygen.yml'), 'utf-8')
);

const platform = process.argv.slice(2)[1];
const uploadArr = [];

if (fs.existsSync(buildInfoFilePath)) {
  const buildInfo = JSON.parse(fs.readFileSync(buildInfoFilePath));

  if ('windows' in buildInfo && /(win|all)/.test(platform)) {
    const { local, remote } = buildInfo.windows;
    uploadArr.push({ local, remote });
  }

  if ('mac' in buildInfo && /(mac|all)/.test(platform)) {
    const { local, remote } = buildInfo.mac;
    uploadArr.push({ local, remote });
  }

  ssh(auth, uploadArr)
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(0);
    });
} else {
  log.error('The build information file was not found!');
}

export {};
