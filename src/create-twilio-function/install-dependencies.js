const { projectInstall } = require('pkg-install');

const { getDebugFunction } = require('../utils/logger');

const debug = getDebugFunction('create-twilio-function:install-dependencies');

async function installDependencies(targetDirectory) {
  debug('Installing dependencies');
  const options = { cwd: targetDirectory };
  const { stdout } = await projectInstall(options);
  return stdout;
}

module.exports = { installDependencies };
