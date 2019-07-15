import { open as fsOpen } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { writeFile } from 'gitignore';
import { createWriteStream } from 'fs';
const writeGitignore = promisify(writeFile);
const open = promisify(fsOpen);

export default function createGitignore(dirPath) {
  const fullPath = join(dirPath, '.gitignore');
  return open(fullPath, 'wx').then(fd => {
    const stream = createWriteStream(null, { fd: fd });
    return writeGitignore({ type: 'Node', file: stream });
  });
}
