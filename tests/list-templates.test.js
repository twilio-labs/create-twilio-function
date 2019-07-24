const templateActions = require('twilio-run/dist/templating/actions');
const listTemplates = require('../src/commands/list-templates');

jest.mock('twilio-run/dist/templating/actions');

describe('listTemplates', () => {
  it('gets templates from twilio-run and displays them', async () => {
    const consoleSpy = jest
      .spyOn(global.console, 'log')
      .mockImplementation(() => {});
    const template = {
      name: 'Test template',
      id: 'test-template',
      description: 'A template to test with'
    };
    templateActions.fetchListOfTemplates.mockResolvedValue([template]);

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
