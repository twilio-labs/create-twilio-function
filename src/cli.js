const yargs = require('yargs');
const { handler, describe, cliInfo } = require('./command');

function cli(cwd) {
  yargs.help();
  yargs.alias('h', 'help');
  yargs.version();
  yargs.alias('v', 'version');

  yargs.default('path', cwd);

  yargs.usage(describe);
  yargs.command(
    '$0 <name>',
    describe,
    command => {
      command.positional('name', {
        describe: 'Name of your project.',
        type: 'string'
      });
      command.options(cliInfo.options);
    },
    argv => handler(argv)
  );

  return yargs;
}

module.exports = cli;
