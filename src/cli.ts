import * as yargs from 'yargs';
import { Argv, Arguments } from 'yargs';
import { handler, describe, cliInfo } from './command';

export default function cli(cwd: string) {
  yargs.help();
  yargs.alias('h', 'help');
  yargs.version();
  yargs.alias('v', 'version');

  yargs.default('path', cwd);

  yargs.usage(describe);
  yargs.command({
    command: '$0 <name>',
    describe: describe,
    builder: (yargs: Argv) =>
      yargs
        .positional('name', {
          describe: 'Name of your project.',
          type: 'string'
        })
        .options(cliInfo.options),
    handler: (argv: { [key: string]: unknown }): Promise<void> => handler(argv)
  });

  return yargs;
}
