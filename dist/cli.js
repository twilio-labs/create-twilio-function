"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const command_1 = require("./command");
function cli(cwd) {
    yargs.help();
    yargs.alias('h', 'help');
    yargs.version();
    yargs.alias('v', 'version');
    yargs.default('path', cwd);
    yargs.usage(command_1.describe);
    yargs.command('$0 <name>', command_1.describe, (command) => {
        command.positional('name', {
            describe: 'Name of your project.',
            type: 'string'
        });
        command.options(command_1.cliInfo.options);
        return yargs;
    }, argv => command_1.handler(argv));
    return yargs;
}
exports.default = cli;
