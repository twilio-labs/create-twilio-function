const inquirer = require('inquirer');

function validateAccountSid(input) {
  if (input.startsWith('AC') || input === '') {
    return true;
  } else {
    return 'An Account SID starts with "AC".';
  }
}

const nameRegex = /^[A-Za-z0-9\-]+$/;

function validateProjectName(input) {
  if (!input.match(nameRegex)) {
    return 'Project name has invalid characters.';
  } else {
    return true;
  }
}

async function promptForAccountDetails(config) {
  if (config.skipCredentials) return {};
  const questions = [];
  if (typeof config.accountSid === 'undefined') {
    questions.push({
      type: 'input',
      name: 'accountSid',
      message: 'Twilio Account SID',
      validate: validateAccountSid
    });
  }
  if (typeof config.authToken === 'undefined') {
    questions.push({
      type: 'password',
      name: 'authToken',
      message: 'Twilio auth token'
    });
  }
  return await inquirer.prompt(questions);
}

async function promptForProjectName() {
  const questions = [
    {
      type: 'input',
      name: 'name',
      message:
        'Project names may only include the characters A-Z, a-z, 0-9 and _. Please choose a new project name.',
      validate: validateProjectName
    }
  ];
  return await inquirer.prompt(questions);
}

module.exports = {
  promptForAccountDetails,
  promptForProjectName,
  validateAccountSid,
  validateProjectName,
  nameRegex
};
