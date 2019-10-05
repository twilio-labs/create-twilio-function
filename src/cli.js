const yargs = require('yargs');
const DefaultCommand = require('./command');
const ListTemplateCommand = require('twilio-run/dist/commands/list-templates');
const updateNotifier = require('update-notifier');

const pkg = require('./package.json');
updateNotifier({
  pkg
}).notify();

function cli(cwd) {
  yargs.help();
  yargs.alias('h', 'help');
  yargs.version();
  yargs.alias('v', 'version');
  yargs.default('path', cwd);
  yargs.usage(DefaultCommand.describe);
  yargs.command(DefaultCommand);
  yargs.command(ListTemplateCommand);
  return yargs;
}

module.exports = cli;