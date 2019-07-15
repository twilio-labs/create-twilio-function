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
function validateAccountSid(input) {
    if (input.startsWith('AC') || input === '') {
        return true;
    }
    else {
        return 'An Account SID starts with "AC".';
    }
}
function promptForAccountDetails(config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (config.skipCredentials)
            return {};
        const questions = [];
        if (typeof config.accountSid === 'undefined') {
            questions.push({
                type: 'input',
                name: 'accountSid',
                message: 'Twilio Account SID',
                validate: input => {
                    return validateAccountSid(input);
                }
            });
        }
        if (typeof config.authToken === 'undefined') {
            questions.push({
                type: 'password',
                name: 'authToken',
                message: 'Twilio auth token'
            });
        }
        return yield inquirer.prompt(questions);
    });
}
exports.promptForAccountDetails = promptForAccountDetails;
