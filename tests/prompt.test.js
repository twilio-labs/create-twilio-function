const {
  validateAccountSid,
  promptForAccountDetails,
  promptForProjectName
} = require('../src/create-twilio-function/prompt');
const inquirer = require('inquirer');

describe('accountSid validation', () => {
  test('an accountSid should start with "AC"', () => {
    expect(validateAccountSid('AC123')).toBe(true);
  });

  test('an accountSid can be left blank', () => {
    expect(validateAccountSid('')).toBe(true);
  });

  test('an accountSid should not begin with anything but "AC"', () => {
    expect(validateAccountSid('blah')).toEqual(
      'An Account SID starts with "AC".'
    );
  });
});

describe('promptForAccountDetails', () => {
  test(`should ask for an accountSid if not specified`, async () => {
    inquirer.prompt = jest.fn(() =>
      Promise.resolve({
        accountSid: 'AC1234',
        authToken: 'test-auth-token'
      })
    );
    await promptForAccountDetails({
      name: 'function-test'
    });
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    expect(inquirer.prompt).toHaveBeenCalledWith(expect.any(Array));
  });

  test(`should ask for an auth if not specified`, async () => {
    inquirer.prompt = jest.fn(() =>
      Promise.resolve({
        authToken: 'test-auth-token'
      })
    );
    await promptForAccountDetails({
      name: 'function-test',
      accountSid: 'AC1234'
    });
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    expect(inquirer.prompt).toHaveBeenCalledWith(expect.any(Array));
  });

  test(`should not prompt if account sid and auth token specified`, async () => {
    inquirer.prompt = jest.fn(() =>
      Promise.resolve({
        accountSid: 'AC1234',
        authToken: 'test-auth-token'
      })
    );
    await promptForAccountDetails({
      name: 'function-test',
      accountSid: 'AC5678',
      authToken: 'other-test-token'
    });
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    expect(inquirer.prompt).toHaveBeenCalledWith([]);
  });

  test('should not ask for credentials if skip-credentials flag is true', async () => {
    inquirer.prompt = jest.fn(() => {});
    await promptForAccountDetails({
      skipCredentials: true
    });
    expect(inquirer.prompt).not.toHaveBeenCalled();
  });
});

describe('promptForProjectName', () => {
  test('should ask for a project name', async () => {
    inquirer.prompt = jest.fn(() =>
      Promise.resolve({
        name: 'test-name'
      })
    );
    await promptForProjectName(['must be valid']);
    expect(inquirer.prompt).toHaveBeenCalledTimes(1);
    expect(inquirer.prompt).toHaveBeenCalledWith(expect.any(Array));
  });
});
