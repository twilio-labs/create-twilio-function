const yargs = require('yargs');
const listTemplates = require('./commands/list-templates');
const DefaultCommand = require('./command');

function cli(cwd) {
  yargs.help();
  yargs.alias('h', 'help');
  yargs.version();
  yargs.alias('v', 'version');

  yargs.default('path', cwd);
  yargs.usage(DefaultCommand.describe);
  yargs.command(DefaultCommand);
  yargs.command({
    command: 'list-templates',
    desc: 'List the available templates you can create a project with.',
    handler: argv => listTemplates(argv)
  });

  return yargs;
}

module.exports = cli;
