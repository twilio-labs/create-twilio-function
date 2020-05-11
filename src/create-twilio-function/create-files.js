const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const versions = require('./versions');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
const { COPYFILE_EXCL } = fs.constants;
const stat = promisify(fs.stat);

function createDirectory(pathName, dirName) {
  return mkdir(path.join(pathName, dirName));
}

async function createFile(fullPath, content) {
  return writeFile(fullPath, content, { flag: 'wx' });
}

const javaScriptDeps = { 'twilio-run': versions.twilioRun };
const typescriptDeps = {
  'twilio-run': versions.twilioRun,
  typescript: versions.typescript,
  '@twilio-labs/serverless-runtime-types': versions.serverlessRuntimeTypes,
};

function createPackageJSON(pathName, name, typescript = false) {
  const fullPath = path.join(pathName, 'package.json');
  const scripts = {
    test: 'echo "Error: no test specified" && exit 1',
    start: 'twilio-run',
    deploy: 'twilio-run deploy',
  }
  if (typescript) {
    scripts['build'] = 'tsc';
    scripts['prestart'] = 'npm run build';
    scripts['predeploy'] = 'npm run build';
  }
  const packageJSON = JSON.stringify(
    {
      name,
      version: '0.0.0',
      private: true,
      scripts: scripts,
      devDependencies: typescript ? typescriptDeps : javaScriptDeps,
      engines: { node: versions.node },
    },
    null,
    2
  );
  return createFile(fullPath, packageJSON);
}

function copyRecursively(src, dest) {
  return readdir(src).then((children) => {
    return Promise.all(
      children.map((child) =>
        stat(path.join(src, child)).then((stats) => {
          if (stats.isDirectory()) {
            return mkdir(path.join(dest, child)).then(() =>
              copyRecursively(path.join(src, child), path.join(dest, child))
            );
          }
          return copyFile(
            path.join(src, child),
            path.join(dest, child),
            COPYFILE_EXCL
          );
        })
      )
    );
  });
}

function createExampleFromTemplates(pathName) {
  return copyRecursively(
    path.join(__dirname, '..', '..', 'templates'),
    pathName
  );
}

function createEnvFile(pathName, { accountSid, authToken }) {
  const fullPath = path.join(pathName, '.env');
  const content = `ACCOUNT_SID=${accountSid}
AUTH_TOKEN=${authToken}`;
  return createFile(fullPath, content);
}

function createNvmrcFile(pathName) {
  const fullPath = path.join(pathName, '.nvmrc');
  const content = versions.node;
  return createFile(fullPath, content);
}

function createTsconfigFile(pathName) {
  const fullPath = path.join(pathName, 'tsconfig.json');
  return createFile(
    fullPath,
    JSON.stringify({
      compilerOptions: {
        target: 'es5',
        module: 'commonjs',
        strict: true,
        esModuleInterop: true,
        outDir: 'functions',
        skipLibCheck: true
      },
    },
    null,
    2)
  );
}

module.exports = {
  createDirectory,
  createPackageJSON,
  createExampleFromTemplates,
  createEnvFile,
  createNvmrcFile,
  createTsconfigFile,
};
