const { promisify } = require('util');
const path = require('path');

const boxen = require('boxen');
const rimraf = promisify(require('rimraf'));
const { downloadTemplate } = require('twilio-run/dist/templating/actions');

const { logger, getOraSpinner, setLogLevelByName, getDebugFunction } = require('./utils/logger');
const { promptForAccountDetails, promptForProjectName } = require('./create-twilio-function/prompt');
const validateProjectName = require('./create-twilio-function/validate-project-name');
const {
  createDirectory,
  createEnvFile,
  createExampleFromTemplates,
  createPackageJSON,
  createNvmrcFile,
  createTsconfigFile,
  createEmptyFileStructure,
} = require('./create-twilio-function/create-files');
const createGitignore = require('./create-twilio-function/create-gitignore');
const importCredentials = require('./create-twilio-function/import-credentials');
const { installDependencies } = require('./create-twilio-function/install-dependencies');
const successMessage = require('./create-twilio-function/success-message');

const debug = getDebugFunction('create-twilio-function');

async function cleanUpAndExit(projectDir, spinner, errorMessage) {
  spinner.fail(errorMessage);
  spinner.start('Cleaning up project directories and files');
  await rimraf(projectDir);
  spinner.stop().clear();
  process.exitCode = 1;
}

async function performTaskWithSpinner(spinner, message, task) {
  spinner.start(message);
  await task();
  spinner.succeed();
}

async function createTwilioFunction(config) {
  const { valid, errors } = validateProjectName(config.name);
  if (!valid) {
    const { name } = await promptForProjectName(errors);
    config.name = name;
  }
  const projectDir = path.join(config.path, config.name);
  const projectType = config.typescript ? 'typescript' : 'javascript';
  const spinner = getOraSpinner();
  setLogLevelByName(config.logLevel);

  try {
    await performTaskWithSpinner(spinner, 'Creating project directory', async () => {
      debug('Creating project directory: %s', projectDir);
      await createDirectory(config.path, config.name);
    });
  } catch (error) {
    debug('%O', error);
    if (error.code === 'EEXIST') {
      spinner.fail(
        `A directory called '${config.name}' already exists. Please create your function in a new directory.`,
      );
    } else if (error.code === 'EACCES') {
      spinner.fail(`You do not have permission to create files or directories in the path '${config.path}'.`);
    } else {
      spinner.fail(error.message);
    }
    process.exitCode = 1;
    return;
  }

  // Check to see if the request is valid for a template or an empty project
  if (config.empty && config.template) {
    await cleanUpAndExit(
      projectDir,
      spinner,
      'You cannot scaffold an empty Functions project with a template. Please choose empty or a template.',
    );
    return;
  }
  // Check to see if the project wants typescript and a template
  if (config.template && projectType === 'typescript') {
    await cleanUpAndExit(
      projectDir,
      spinner,
      'There are no TypeScript templates available. You can generate an example project or an empty one with the --empty flag.',
    );
    return;
  }

  // Get account sid and auth token
  let accountDetails = await importCredentials(config);
  if (Object.keys(accountDetails).length === 0) {
    accountDetails = await promptForAccountDetails(config);
  }
  config = { ...accountDetails, ...config };

  // Scaffold project
  spinner.start('Creating project directories and files');

  await createEnvFile(projectDir, {
    accountSid: config.accountSid,
    authToken: config.authToken,
  });
  await createNvmrcFile(projectDir);
  await createPackageJSON(projectDir, config.name, projectType);
  if (projectType === 'typescript') {
    await createTsconfigFile(projectDir);
  }
  if (config.template) {
    spinner.succeed();
    spinner.start(`Downloading template: "${config.template}"`);
    await createDirectory(projectDir, 'functions');
    await createDirectory(projectDir, 'assets');
    try {
      await downloadTemplate(config.template, '', projectDir);
    } catch (error) {
      debug('%O', error);
      await cleanUpAndExit(projectDir, spinner, `The template "${config.template}" doesn't exist`);
      return;
    }
  } else if (config.empty) {
    await createEmptyFileStructure(projectDir, projectType);
  } else {
    await createExampleFromTemplates(projectDir, projectType);
  }
  spinner.succeed();

  // Download .gitignore file from https://github.com/github/gitignore/
  try {
    await performTaskWithSpinner(spinner, 'Downloading .gitignore file', async () => {
      await createGitignore(projectDir);
    });
  } catch (error) {
    debug('%O', error);
    cleanUpAndExit(projectDir, spinner, 'Could not download .gitignore file');
    return;
  }

  // Install dependencies with npm
  try {
    await performTaskWithSpinner(spinner, 'Installing dependencies', async () => {
      await installDependencies(projectDir);
    });
  } catch (error) {
    debug('%O', error);
    spinner.fail();
    logger.info(
      `There was an error installing the dependencies, but your project is otherwise complete in ./${config.name}`,
    );
  }

  // Success message
  logger.info(boxen(await successMessage(config), { padding: 1, borderStyle: 'round' }));
}

module.exports = createTwilioFunction;
