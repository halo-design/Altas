const path = require('path');
const log = require('electron-log');
const fs = require('fs-extra');
const _ = require('lodash');

const saveInfo = (data) => {
  const infoFilePath = path.join(__dirname, '../packages', `build-info.json`);
  const hasInfoFile = fs.existsSync(infoFilePath);

  if (hasInfoFile) {
    const oldData = JSON.parse(fs.readFileSync(infoFilePath));
    fs.writeFileSync(infoFilePath, JSON.stringify(_.merge(oldData, data), null, 2));
  } else {
    fs.writeFileSync(infoFilePath, JSON.stringify(data, null, 2));
  }
}

exports.default = async (context) => {
  const { packager, file, updateInfo } = context;
  const { platform } = packager;
  const { name, nodeName } = platform;

  log.info(`[${nodeName}] The ${name} application build complete!`);

  if (/(mac|windows)/.test(name)) {
    const local = file.replace('.blockmap', '');
    const basename = path.basename(local);
    const remote = `www/${basename}`;
    let data = {};
    data[name] = { basename, local, remote, updateInfo };

    saveInfo(data);
  }

  process.exit(0);
}
