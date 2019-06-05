const program = require('commander');
const { clear, createBundle } = require('./utils');
const { execSync } = require('child_process');

program
  .command('clear')
  .option('-d --dir', 'Delete the specified directory.')
  .action((cmd: any) => {
    if (cmd.dir) {
      clear(cmd.dir);
    } else {
      clear('renderer/static');
    }
  });

program
  .command('febuild')
  .option('-p --production', 'Production mode build frontend bundles.')
  .action((cmd: any) => {
    if (cmd.production) {
      createBundle('../src/frontend/core/index.tsx', {
        cacheDir: '.cache/frontend_build_production',
        minify: true,
        sourceMaps: false,
        watch: false,
      }).bundle();
    } else {
      createBundle('../src/frontend/core/index.tsx', {
        cacheDir: '.cache/frontend_build_development',
        minify: false,
        sourceMaps: true,
        watch: false,
      }).bundle();
    }
  });

program
  .command('bebuild')
  .option('-p --production', 'Production mode build backend bundles.')
  .action((cmd: any) => {
    if (cmd.production) {
      createBundle('../src/backend/main.ts', {
        cacheDir: '.cache/backend_build_production',
        outDir: './renderer',
        outFile: 'main.js',
        minify: true,
        sourceMaps: false,
        watch: false,
      }).bundle();
    } else {
      createBundle('../src/backend/main.ts', {
        cacheDir: '.cache/backend_build_development',
        outDir: './renderer',
        outFile: 'main.js',
        minify: false,
        sourceMaps: false,
        watch: false,
      }).bundle();
    }
  });

program.command('serve').action(async () => {
  await createBundle('../src/frontend/core/index.tsx', {
    cacheDir: '.cache/frontend_serve_development',
    detailedReport: false,
    minify: false,
    sourceMaps: true,
    watch: true,
  }).bundle();

  await createBundle('../src/backend/main.ts', {
    cacheDir: '.cache/backend_serve_development',
    outDir: './renderer',
    outFile: 'main.js',
    detailedReport: false,
    minify: false,
    sourceMaps: true,
    watch: true,
  }).bundle();
});

program
  .command('app')
  .option('--with-build', 'Build project before start electron.')
  .action((cmd: any) => {
    if (cmd.withBuild) {
      execSync('npm run build', { stdio: 'inherit' });
    }
    execSync('NODE_ENV=development electron ./renderer/main.js', {
      stdio: 'inherit',
    });
  });

program.parse(process.argv);
