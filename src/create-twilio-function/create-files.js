const versions = require('./versions');
const fs = require('fs');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const open = promisify(fs.open);
const write = promisify(fs.write);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

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

function createExampleFromTemplates(path) {
  return readdir('./templates').then(dirs =>
    Promise.all(
      dirs.map(dir =>
        mkdir(`${path}/${dir}`)
          .then(() => readdir(`./templates/${dir}`))
          .then(files =>
            Promise.all(
              files.map(file =>
                copyFile(`./templates/${dir}/${file}`, `${path}/${dir}/${file}`)
              )
            )
          )
      )
    )
  );
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
