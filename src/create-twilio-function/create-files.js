const versions = require('./versions');
const fs = require('fs');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const open = promisify(fs.open);
const write = promisify(fs.write);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
const { COPYFILE_EXCL } = fs.constants;
const stat = promisify(fs.stat);

function createDirectory(path, dirName) {
  return mkdir(path + '/' + dirName);
}

function createFile(fullPath, content) {
  return open(fullPath, 'wx').then(fd => {
    return write(fd, content);
  });
}

function createPackageJSON(path, name) {
  const fullPath = `${path}/package.json`;
  const packageJSON = JSON.stringify(
    {
      name: name,
      version: '0.0.0',
      private: true,
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        start: 'twilio-run --env'
      },
      devDependencies: {
        'twilio-run': versions.twilioRun
      },
      engines: { node: versions.node }
    },
    null,
    2
  );
  return createFile(fullPath, packageJSON);
}

function copyRecursively(src, dest) {
  return readdir(src).then(children => {
    return Promise.all(
      children.map(child =>
        stat(`${src}/${child}`).then(stat => {
          if (stat.isDirectory()) {
            return mkdir(`${dest}/${child}`).then(() =>
              copyRecursively(`${src}/${child}`, `${dest}/${child}`)
            );
          } else {
            return copyFile(
              `./${src}/${child}`,
              `${dest}/${child}`,
              COPYFILE_EXCL
            );
          }
        })
      )
    );
  });
}

function createExampleFromTemplates(path) {
  return copyRecursively('./templates', path);
}

function createEnvFile(path, { accountSid, authToken }) {
  const fullPath = `${path}/.env`;
  const content = `ACCOUNT_SID=${accountSid}
AUTH_TOKEN=${authToken}`;
  return createFile(fullPath, content);
}

function createNvmrcFile(path) {
  const fullPath = `${path}/.nvmrc`;
  const content = versions.node;
  return createFile(fullPath, content);
}

module.exports = {
  createDirectory,
  createPackageJSON,
  createExampleFromTemplates,
  createEnvFile,
  createNvmrcFile
};
