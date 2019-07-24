const listTemplates = require('../src/commands/list-templates');
const ora = require('ora');
const nock = require('nock');

jest.mock('ora');
ora.mockImplementation(() => {
  const spinner = {
    start: () => spinner,
    stop: () => spinner
  };
  return spinner;
});

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.enableNetConnect();
});

describe('listTemplates', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('gets templates from twilio-run and displays them', async () => {
    const consoleSpy = jest
      .spyOn(global.console, 'log')
      .mockImplementation(() => {});
    const template = {
      name: 'Test template',
      id: 'test-template',
      description: 'A template to test with'
    };
    nock('https://raw.githubusercontent.com')
      .get('/twilio-labs/function-templates/master/templates.json')
      .reply(200, {
        templates: [template]
      });

    await listTemplates();

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(template.name)
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(template.id)
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(template.description)
    );
  });
});
