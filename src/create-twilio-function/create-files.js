const versions = require('./versions');
const fs = require('fs');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
const { COPYFILE_EXCL } = fs.constants;
const stat = promisify(fs.stat);
const path = require('path');
const Mustache = require('mustache');

const EXAMPLE_DIR = path.join(__dirname, '..', '..', 'example');
const TEMPLATES_DIR = path.join(__dirname, '..', '..', 'templates');

let TEST_FILE_TEMPLATE;

function createDirectory(pathName, dirName) {
  return mkdir(path.join(pathName, dirName));
}

async function createFile(fullPath, content) {
  return writeFile(fullPath, content, { flag: 'wx' });
}

function createPackageJSON(pathName, name) {
  const fullPath = path.join(pathName, 'package.json');
  const packageJSON = JSON.stringify(
    {
      name: name,
      version: '0.0.0',
      private: true,
      scripts: {
        test: 'jest',
        start: 'twilio-run',
        deploy: 'twilio-run deploy'
      },
      devDependencies: {
        'twilio-run': versions.twilioRun,
        'jest': versions.jest,
        'dotenv': versions.dotenv
      },
      jest: {
        collectCoverage: true,
        setupFilesAfterEnv: ['./jest.setup.js'],
        testEnvironment: 'node',
        testPathIgnorePatterns: ["/node_modules/", "/assets/"]
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
        stat(path.join(src, child)).then(stat => {
          if (stat.isDirectory()) {
            return mkdir(path.join(dest, child)).then(() =>
              copyRecursively(path.join(src, child), path.join(dest, child))
            );
          } else {
            return copyFile(
              path.join(src, child),
              path.join(dest, child),
              COPYFILE_EXCL
            ).catch(console.error);
          }
        })
      )
    );
  });
}

function createExample(pathName) {
  return copyRecursively(
    EXAMPLE_DIR,
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

function createJestSetupFile(pathName) {
  return copyRecursively(
    path.join(TEMPLATES_DIR, 'jest'),
    pathName
  );
}

function createTestFile(filePath) {
  if (!TEST_FILE_TEMPLATE) {
    TEST_FILE_TEMPLATE = fs.readFileSync(path.join(TEMPLATES_DIR, 'test.mustache'), { encoding: 'utf-8' });
    Mustache.parse(TEST_FILE_TEMPLATE);
  }

  const fileName = path.basename(filePath, '.js');
  const testFileName = path.join(path.dirname(filePath), `${fileName}.test.js`);
  return createFile(testFileName, Mustache.render(TEST_FILE_TEMPLATE, { fileName }));
}

function createTestFiles(pathName) {
  return readdir(pathName).then(children => {
    return Promise.all(
      children.map(child => {
        const fullPath = path.join(pathName, child);
        return stat(fullPath).then(stat => {
          if (stat.isDirectory()) {
            return createTestFiles(fullPath);
          } else if (!fullPath.match(/\.(test|spec)\.js$/)) {
            return createTestFile(fullPath);
          } else {
            return Promise.resolve();
          }
        })
      })
    );
  });
}

module.exports = {
  createDirectory,
  createPackageJSON,
  createExample,
  createEnvFile,
  createNvmrcFile,
  createJestSetupFile,
  createTestFiles
};
