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
    spinner.text = 'The files are in transit...';
    server
      .putFiles(files)
      .then(() => {
        spinner.succeed(`Total ${files.length} files transfers completed!`);
        resolve();
      })
      .catch((error: any) => {
        spinner.fail('Files transfers failed!');
        reject(error);
      });
  });
};

exports.createBundle = (file: string, opts: object) => {
  const baseOpts = {
    cache: true,
    cacheDir: '.cache/build',
    detailedReport: false,
    hmrHostname: '',
    hmrPort: 0,
    https: false,
    logLevel: 3,
    minify: false,
    outDir: './renderer/static',
    outFile: 'index.js',
    publicUrl: './',
    sourceMaps: true,
    target: 'electron',
    watch: true,
  };

  let options = baseOpts;

  if (opts) {
    options = _.merge(baseOpts, opts);
  }

  return new Bundler(file, options);
};
