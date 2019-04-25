const Path = require('path')
const { createBundle } = require('./utils')

const mode = process.argv.slice(2)[1]

if (/(dev|prod)/.test(mode)) {
  createBundle(
    Path.join(__dirname, '../src/core/index.tsx'),
    mode === 'prod'
    ? {
      watch: false,
      minify: true,
      sourceMaps: false,
      detailedReport: true
    }
    : {}
  ).bundle()
} else if (mode === 'extra') {
  createBundle(
    Path.join(__dirname, '../src/core/extra.tsx'), {
      watch: false,
      minify: true,
      sourceMaps: false,
      detailedReport: true,
      outDir: './renderer/static',
      outFile: 'extra.min.js',
      target: 'browser'
    }
  ).bundle()
} else if (mode === 'main') {
  createBundle(
    Path.join(__dirname, '../src/app/main.ts'), {
      watch: false,
      minify: true,
      sourceMaps: false,
      detailedReport: true,
      outDir: './renderer',
      outFile: 'main.js'
    }
    ).bundle()
}
