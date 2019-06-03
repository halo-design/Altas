const Path = require('path');
const { createBundle } = require('./utils');

const mode = process.argv.slice(2)[1];

if (/(dev|prod)/.test(mode)) {
  createBundle(
    Path.join(__dirname, '../src/frontend/core/index.tsx'),
    mode === 'prod'
      ? {
          detailedReport: true,
          minify: true,
          sourceMaps: false,
          watch: false,
        }
      : { cacheDir: '.cache/dev' }
  ).bundle();
} else if (mode === 'extra') {
  createBundle(Path.join(__dirname, '../src/frontend/core/extra.tsx'), {
    cacheDir: '.cache/extra',
    detailedReport: true,
    minify: true,
    outDir: './renderer/static',
    outFile: 'extra.min.js',
    sourceMaps: false,
    target: 'browser',
    watch: false,
  }).bundle();
} else if (mode === 'main') {
  createBundle(Path.join(__dirname, '../src/backend/main.ts'), {
    cacheDir: '.cache/main',
    detailedReport: true,
    minify: true,
    outDir: './renderer',
    outFile: 'main.js',
    sourceMaps: false,
    watch: false,
  }).bundle();
}
