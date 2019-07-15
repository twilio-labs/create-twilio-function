import { join } from 'path';
import versions from './versions';
import {
  open as fsOpen,
  write as fsWrite,
  readdir as fsReaddir,
  copyFile as fsCopyFile,
  stat as fsStat,
  mkdir as fsMkdir,
  constants
} from 'fs';
import { promisify } from 'util';
const mkdir = promisify(fsMkdir);
const open = promisify(fsOpen);
const write = promisify(fsWrite);
const readdir = promisify(fsReaddir);
const copyFile = promisify(fsCopyFile);
const stat = promisify(fsStat);

export function createDirectory(pathName, dirName) {
  return mkdir(join(pathName, dirName));
}

function createFile(fullPath, content) {
  return open(fullPath, 'wx').then(fd => {
    return write(fd, content);
  });
}

export function createPackageJSON(pathName, name) {
  const fullPath = join(pathName, 'package.json');
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
        stat(join(src, child)).then(stat => {
          if (stat.isDirectory()) {
            return mkdir(join(dest, child)).then(() =>
              copyRecursively(join(src, child), join(dest, child))
            );
          } else {
            return copyFile(
              join(src, child),
              join(dest, child),
              constants.COPYFILE_EXCL
            ).catch(console.error);
          }
        })
      )
    );
  });
}

export function createExampleFromTemplates(pathName) {
  return copyRecursively(join(__dirname, '..', '..', 'templates'), pathName);
}

export function createEnvFile(pathName, { accountSid, authToken }) {
  const fullPath = join(pathName, '.env');
  const content = `ACCOUNT_SID=${accountSid}
AUTH_TOKEN=${authToken}`;
  return createFile(fullPath, content);
}

export function createNvmrcFile(pathName) {
  const fullPath = join(pathName, '.nvmrc');
  const content = versions.node;
  return createFile(fullPath, content);
}
