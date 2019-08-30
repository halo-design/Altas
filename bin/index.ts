const program = require('commander');
const { clear, createBundle } = require('./utils');
const { execSync } = require('child_process');
const glob = require('glob');

const pages = glob.sync('src/web/pages/**/entry.tsx');

const mainEntry = '../src/web/main/core/index.tsx';
const nativeEntry = '../src/native/main.ts';

program
  .command('clear')
  .option('-d --dir', 'Delete the specified directory.')
  .action((cmd: any) => {
    if (cmd.dir) {
      clear(cmd.dir);
    } else {
      clear('renderer/static');
      clear('.cache');
    }
  });

program
  .command('Wbuild')
  .option('-p --production', 'Production mode build web bundles.')
  .action((cmd: any) => {
    if (cmd.production) {
      createBundle(mainEntry, {
        cacheDir: '.cache/web_build_production',
        minify: true,
        sourceMaps: false,
        watch: false,
      }).bundle();
    } else {
      createBundle(mainEntry, {
        cacheDir: '.cache/web_build_development',
        minify: false,
        sourceMaps: true,
        watch: false,
      }).bundle();
    }
  });

program
  .command('Pbuild')
  .option('-p --production', 'Production mode build pages bundles.')
  .action((cmd: any) => {
    if (cmd.production) {
      createBundle(pages, {
        cacheDir: '.cache/pages_build_production',
        minify: true,
        sourceMaps: false,
        watch: false,
      }).bundle();
    } else {
      createBundle(pages, {
        cacheDir: '.cache/pages_build_development',
        minify: false,
        sourceMaps: true,
        watch: false,
      }).bundle();
    }
  });

program
  .command('Nbuild')
  .option('-p --production', 'Production mode build native bundles.')
  .action((cmd: any) => {
    if (cmd.production) {
      createBundle(nativeEntry, {
        cacheDir: '.cache/native_build_production',
        outDir: './renderer',
        outFile: 'main.js',
        minify: true,
        sourceMaps: false,
        watch: false,
      }).bundle();
    } else {
      createBundle(nativeEntry, {
        cacheDir: '.cache/native_build_development',
        outDir: './renderer',
        outFile: 'main.js',
        minify: false,
        sourceMaps: false,
        watch: false,
      }).bundle();
    }
  });

program.command('serve').action(async () => {
  await createBundle(mainEntry, {
    cacheDir: '.cache/web_serve_development',
    detailedReport: false,
    minify: false,
    sourceMaps: true,
    watch: true,
  }).bundle();

  await createBundle(pages, {
    cacheDir: '.cache/pages_serve_development',
    minify: false,
    sourceMaps: true,
    watch: true,
  }).bundle();

  await createBundle(nativeEntry, {
    cacheDir: '.cache/native_serve_development',
    outDir: './renderer',
    outFile: 'main.js',
    detailedReport: false,
    minify: false,
    sourceMaps: false,
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

program
  .command('pack')
  .option('--mac', 'Build macOS application.')
  .option('--win', 'Build windows application.')
  .option('--with-build', 'Build project before pack application.')
  .action((cmd: any) => {
    if (cmd.withBuild) {
      execSync('npm run build:p', { stdio: 'inherit' });
    }
    if (cmd.mac) {
      execSync('electron-builder --mac', {
        stdio: 'inherit',
      });
    }
    if (cmd.win) {
      execSync('electron-builder --win', {
        stdio: 'inherit',
      });
    }
  });

program
  .command('lint')
  .option('--fix', 'Automatically fixes code syntax problems.')
  .action((cmd: any) => {
    if (cmd.fix) {
      execSync(`tslint -c tslint.yml '**/*.ts?(x)' --fix`, {
        stdio: 'inherit',
      });
      execSync(`prettier -c '**/*.js' --write`, {
        stdio: 'inherit',
      });
      execSync(`stylelint '**/*.scss' --fix`, {
        stdio: 'inherit',
      });
    } else {
      execSync(`tslint -c tslint.yml '**/*.ts?(x)'`, {
        stdio: 'inherit',
      });
      execSync(`prettier -c '**/*.js'`, {
        stdio: 'inherit',
      });
      execSync(`stylelint '**/*.scss'`, {
        stdio: 'inherit',
      });
    }
  });

program.parse(process.argv);
