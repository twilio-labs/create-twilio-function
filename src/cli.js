const yargs = require('yargs');
const DefaultCommand = require('./command');

function cli(cwd) {
  yargs.help();
  yargs.alias('h', 'help');
  yargs.version();
  yargs.alias('v', 'version');

  yargs.default('path', cwd);

  yargs.usage(DefaultCommand.describe);
  yargs.command(DefaultCommand);

  return yargs;
}

module.exports = cli;
