"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createTwilioFunction = require("./create-twilio-function");
exports.handler = createTwilioFunction;
exports.cliInfo = {
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
            describe: "Don't ask for Twilio account credentials or import them from the environment",
            type: 'boolean',
            default: false
        },
        'import-credentials': {
            describe: 'Import credentials from the environment variables TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN',
            type: 'boolean',
            default: false
        }
    }
};
exports.describe = 'Creates a new Twilio Function project';
