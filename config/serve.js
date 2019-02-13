const Bundler = require('parcel-bundler')
const Path = require('path')

const file = Path.join(__dirname, '../src/core/index.tsx')

const options = {
  outDir: './browser/static',
  outFile: 'index.js',
  publicUrl: './',
  watch: true,
  cache: true,
  cacheDir: '.cache',
  minify: false,
  target: 'electron',
  https: false,
  logLevel: 3,
  hmrPort: 0,
  sourceMaps: true,
  hmrHostname: '',
  detailedReport: false
};

const bundler = new Bundler(file, options)

bundler.bundle()