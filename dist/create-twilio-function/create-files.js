"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const versions_1 = require("./versions");
const fs_1 = require("fs");
const util_1 = require("util");
const mkdir = util_1.promisify(fs_1.mkdir);
const open = util_1.promisify(fs_1.open);
const write = util_1.promisify(fs_1.write);
const readdir = util_1.promisify(fs_1.readdir);
const copyFile = util_1.promisify(fs_1.copyFile);
const stat = util_1.promisify(fs_1.stat);
function createDirectory(pathName, dirName) {
    return mkdir(path_1.join(pathName, dirName));
}
exports.createDirectory = createDirectory;
function createFile(fullPath, content) {
    return open(fullPath, 'wx').then(fd => {
        return write(fd, content);
    });
}
function createPackageJSON(pathName, name) {
    const fullPath = path_1.join(pathName, 'package.json');
    const packageJSON = JSON.stringify({
        name: name,
        version: '0.0.0',
        private: true,
        scripts: {
            test: 'echo "Error: no test specified" && exit 1',
            start: 'twilio-run --env'
        },
        devDependencies: {
            'twilio-run': versions_1.default.twilioRun
        },
        engines: { node: versions_1.default.node }
    }, null, 2);
    return createFile(fullPath, packageJSON);
}
exports.createPackageJSON = createPackageJSON;
function copyRecursively(src, dest) {
    return readdir(src).then(children => {
        return Promise.all(children.map(child => stat(path_1.join(src, child)).then(stat => {
            if (stat.isDirectory()) {
                return mkdir(path_1.join(dest, child)).then(() => copyRecursively(path_1.join(src, child), path_1.join(dest, child)));
            }
            else {
                return copyFile(path_1.join(src, child), path_1.join(dest, child), fs_1.constants.COPYFILE_EXCL).catch(console.error);
            }
        })));
    });
}
function createExampleFromTemplates(pathName) {
    return copyRecursively(path_1.join(__dirname, '..', '..', 'templates'), pathName);
}
exports.createExampleFromTemplates = createExampleFromTemplates;
function createEnvFile(pathName, { accountSid, authToken }) {
    const fullPath = path_1.join(pathName, '.env');
    const content = `ACCOUNT_SID=${accountSid}
AUTH_TOKEN=${authToken}`;
    return createFile(fullPath, content);
}
exports.createEnvFile = createEnvFile;
function createNvmrcFile(pathName) {
    const fullPath = path_1.join(pathName, '.nvmrc');
    const content = versions_1.default.node;
    return createFile(fullPath, content);
}
exports.createNvmrcFile = createNvmrcFile;
