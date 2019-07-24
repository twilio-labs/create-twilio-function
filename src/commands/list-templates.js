const { fetchListOfTemplates } = require('twilio-run/dist/templating/actions');
const ora = require('ora');
const chalk = require('chalk');

const listTemplates = async function() {
  const spinner = ora();
  spinner.start('Fetching available templates');

  try {
    const templates = await fetchListOfTemplates();
    spinner.stop();
    templates.forEach(template =>
      console.log(
        chalk`‣ ${template.name} ({cyan ${template.id}})\n  {dim ${
          template.description
        }}`
      )
    );
  } catch (err) {
    spinner.fail('Could not retrieve templates');
    process.exit(1);
    return;
  }
};

module.exports = listTemplates;
