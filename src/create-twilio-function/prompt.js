const inquirer = require('inquirer');
const terminalLink = require('terminal-link');

const { logger, setLogLevelByName, getDebugFunction } = require('../utils/logger');
const validateProjectName = require('./validate-project-name');

const debug = getDebugFunction('create-twilio-function:prompt');

function validateAccountSid(input) {
  if (input.startsWith('AC') || input === '') {
    return true;
  }
  return 'An Account SID starts with "AC".';
}

const accountSidQuestion = {
  type: 'input',
  name: 'accountSid',
  message: 'Twilio Account SID',
  validate: validateAccountSid,
};

const authTokenQuestion = {
  type: 'password',
  name: 'authToken',
  message: 'Twilio auth token',
};

function promptForAccountDetails(config) {
  setLogLevelByName(config.logLevel);
  if (config.skipCredentials) {
    debug('Skipping prompting for credentials');
    return {};
  }
  debug('Prompting for missing credentials');
  const questions = [];
  if (typeof config.accountSid === 'undefined') {
    questions.push(accountSidQuestion);
  }
  if (typeof config.authToken === 'undefined') {
    questions.push(authTokenQuestion);
  }
  if (questions.length > 0) {
    logger.info(
      `Please enter your Twilio credentials which you can find in your ${terminalLink(
        'Twilio console',
        'https://twil.io/your-console',
      )}.`,
    );
  }
  return inquirer.prompt(questions);
}

function promptForProjectName(err) {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message: `Project names ${err.join(', ')}. Please choose a new project name.`,
      validate: (name) => {
        const { valid, errors } = validateProjectName(name);
        if (valid) {
          return valid;
        }
        return `Project ${errors.join(', ')}.`;
      },
    },
  ];
  return inquirer.prompt(questions);
}

module.exports = {
  promptForAccountDetails,
  promptForProjectName,
  validateAccountSid,
};
