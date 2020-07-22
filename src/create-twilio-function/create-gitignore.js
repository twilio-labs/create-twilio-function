const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeGitignore = promisify(require('gitignore').writeFile);

const { getDebugFunction } = require('../utils/logger');

const debug = getDebugFunction('create-twilio-function:create-gitignore');
const open = promisify(fs.open);

function createGitignore(dirPath) {
  debug('Downloading gitignore file');
  const fullPath = path.join(dirPath, '.gitignore');
  return open(fullPath, 'wx').then((fd) => {
    const stream = fs.createWriteStream(null, { fd });
    return writeGitignore({
      type: 'Node',
      file: stream,
    });
  });
}

module.exports = createGitignore;
