const Bundler = require('parcel-bundler')
const Path = require('path')
const _ = require('lodash')

const file = Path.join(__dirname, '../src/core/index.tsx')

const baseOpts = {
  outDir: './frame/static',
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
}

const mode = process.argv.slice(2)[1]

const appBundle = (opts) => {
  let options = baseOpts
  if (opts) {
    options = _.merge(baseOpts, opts)
  }
  const bundler = new Bundler(file, options)
  bundler.bundle()
  return bundler
}

if (mode === 'prod') {
  appBundle({
    watch: false,
    cache: false,
    minify: true,
    sourceMaps: false,
    detailedReport: true
  })
} else {
  const bundler = appBundle()
}