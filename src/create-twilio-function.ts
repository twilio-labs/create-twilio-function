import { promptForAccountDetails } from './create-twilio-function/prompt';
import {
  createDirectory,
  createEnvFile,
  createExampleFromTemplates,
  createPackageJSON,
  createNvmrcFile
} from './create-twilio-function/create-files';
import createGitignore from './create-twilio-function/create-gitignore';
import importCredentials from './create-twilio-function/import-credentials';
import { installDependencies } from './create-twilio-function/install-dependencies';
import successMessage from './create-twilio-function/success-message';
import ora from 'ora';
import boxen, { BorderStyle } from 'boxen';
import { Argv } from 'yargs';

export default async function createTwilioFunction(config: {
  [key: string]: unknown;
}): Promise<void> {
  const projectDir = `${config.path}/${config.name}`;

  try {
    await createDirectory(config.path, config.name);
  } catch (e) {
    switch (e.code) {
      case 'EEXIST':
        console.error(
          `A directory called '${
            config.name
          }' already exists. Please create your function in a new directory.`
        );
        break;
      case 'EACCES':
        console.error(
          `You do not have permission to create files or directories in the path '${
            config.path
          }'.`
        );
        break;
      default:
        console.error(e.message);
    }
    return;
  }

  // Get account sid and auth token
  let accountDetails = await importCredentials(config);
  if (Object.keys(accountDetails).length === 0) {
    accountDetails = await promptForAccountDetails(config);
  }
  config = { ...accountDetails, ...config };

  // Scaffold project
  const spinner = ora();
  spinner.start('Creating project directories and files');
  // await createDirectory(projectDir, 'functions');
  // await createDirectory(projectDir, 'assets');
  await createEnvFile(projectDir, {
    accountSid: config.accountSid,
    authToken: config.authToken
  });
  await createNvmrcFile(projectDir);
  await createExampleFromTemplates(projectDir);
  await createPackageJSON(projectDir, config.name);
  spinner.succeed();

  // Download .gitignore file from https://github.com/github/gitignore/
  spinner.start('Downloading .gitignore file');
  await createGitignore(projectDir);
  spinner.succeed();

  // Install dependencies with npm
  spinner.start('Installing dependencies');
  await installDependencies(projectDir);
  spinner.succeed();

  // Success message

  console.log(
    boxen(await successMessage(config), {
      padding: 1,
      borderStyle: BorderStyle.Round
    })
  );
}
