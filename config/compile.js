const Bundler = require('parcel-bundler')
const Path = require('path')

const file = Path.join(__dirname, '../src/core/index.tsx')

const options = {
  outDir: './browser/static',
  outFile: 'index.js',
  publicUrl: './',
  watch: false,
  cache: false,
  cacheDir: '.cache',
  minify: true,
  target: 'electron',
  https: false,
  logLevel: 3,
  hmrPort: 0,
  sourceMaps: false,
  hmrHostname: '',
  detailedReport: true
}

const bundler = new Bundler(file, options)

bundler.bundle()