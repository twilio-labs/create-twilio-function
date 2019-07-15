"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const path_1 = require("path");
const gitignore_1 = require("gitignore");
const writeGitignore = util_1.promisify(gitignore_1.writeFile);
const open = util_1.promisify(fs_1.open);
function createGitignore(dirPath) {
    const fullPath = path_1.join(dirPath, '.gitignore');
    return open(fullPath, 'wx').then(fd => {
        const stream = fs.createWriteStream(null, { fd: fd });
        return writeGitignore({ type: 'Node', file: stream });
    });
}
exports.default = createGitignore;
