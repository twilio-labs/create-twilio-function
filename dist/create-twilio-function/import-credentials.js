"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
function importCredentials(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.skipCredentials ||
            (typeof process.env.TWILIO_ACCOUNT_SID === 'undefined' &&
                typeof process.env.TWILIO_AUTH_TOKEN === 'undefined')) {
            return {};
        }
        const credentials = {
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN
        };
        if (config.importCredentials) {
            return credentials;
        }
        const { importCredentials } = yield inquirer.prompt([
            {
                type: 'confirm',
                name: 'importCredentials',
                message: 'Your account credentials have been found in your environment variables. Import them?',
                default: true
            }
        ]);
        if (importCredentials) {
            return credentials;
        }
        else {
            return {};
        }
    });
}
exports.default = importCredentials;
