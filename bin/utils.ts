const Bundler = require('parcel-bundler');
const fs = require('fs-extra');
const NODE_SSH = require('node-ssh');
const path = require('path');
const _ = require('lodash');
const ora = require('ora');

exports.clear = (dir: string): void => {
  fs.emptyDirSync(path.join(__dirname, '../', dir));
};

exports.buildInfoFilePath = path.join(
  __dirname,
  '../packages',
  `build-info.json`
);

exports.ssh = (auth: object, files: any[]): Promise<string> => {
  const spinner = ora('Ready to upload...\n').start();

  const server = new NODE_SSH();
  return new Promise(async (resolve, reject) => {
    spinner.text = 'Connect to server...';
    await server.connect(auth);
    spinner.text = 'Files uploading...';
    server
      .putFiles(files)
      .then(() => {
        spinner.succeed(`Total ${files.length} files uploaded!`);
        resolve && resolve();
        process.exit(0);
      })
      .catch((error: any) => {
        spinner.fail('Files upload failed!');
        reject && reject(error);
        process.exit(0);
      });
  });
};

exports.createBundle = (file: string | string[], opts: object) => {
  const baseOpts = {
    cache: true,
    detailedReport: true,
    hmrHostname: '',
    hmrPort: 0,
    https: false,
    logLevel: 3,
    outDir: './renderer/static',
    outFile: 'index.js',
    publicUrl: './',
    target: 'electron',
    watch: true,
  };

  let options = baseOpts;

  if (opts) {
    options = _.merge(baseOpts, opts);
  }

  if (Array.isArray(file)) {
    options = _.merge(options, {
      outDir: './renderer/static/pages',
      publicUrl: '../../pages',
      outFile: '',
    });
    return new Bundler(file, options);
  } else {
    return new Bundler(path.join(__dirname, file), options);
  }
};
