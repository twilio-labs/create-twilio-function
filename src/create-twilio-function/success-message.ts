import { getPackageManager } from 'pkg-install';
import chalk from 'chalk';

export default async function successMessage(config) {
  const packageManager = await getPackageManager({
    dev: false,
    exact: false,
    noSave: false,
    bundle: false,
    verbose: false,
    cwd: process.cwd(),
    prefer: null,
    stdio: 'pipe',
    global: false
  });
  return chalk`{green Success!}

  Created {bold ${config.name}} at ${config.path}

  Inside that directory, you can run the following command:

  {blue ${packageManager} start}
    Serves all functions in the ./functions subdirectory and assets in the
    ./assets directory

  Get started by running:

  {blue cd ${config.name}}
  {blue ${packageManager} start}`;
}
