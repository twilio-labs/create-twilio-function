import { CliInfo } from './types';
import * as createTwilioFunction from './create-twilio-function';

export const handler = createTwilioFunction;

export const cliInfo: CliInfo = {
  options: {
    'account-sid': {
      alias: 'a',
      describe: 'The Account SID for your Twilio account',
      type: 'string'
    },
    'auth-token': {
      alias: 't',
      describe: 'Your Twilio account Auth Token',
      type: 'string'
    },
    'skip-credentials': {
      describe:
        "Don't ask for Twilio account credentials or import them from the environment",
      type: 'boolean',
      default: false
    },
    'import-credentials': {
      describe:
        'Import credentials from the environment variables TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN',
      type: 'boolean',
      default: false
    }
  }
};

export const describe = 'Creates a new Twilio Function project';
