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
const prompt_1 = require("./create-twilio-function/prompt");
const create_files_1 = require("./create-twilio-function/create-files");
const create_gitignore_1 = require("./create-twilio-function/create-gitignore");
const import_credentials_1 = require("./create-twilio-function/import-credentials");
const install_dependencies_1 = require("./create-twilio-function/install-dependencies");
const success_message_1 = require("./create-twilio-function/success-message");
const ora_1 = require("ora");
const boxen_1 = require("boxen");
function createTwilioFunction(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectDir = `${config.path}/${config.name}`;
        try {
            yield create_files_1.createDirectory(config.path, config.name);
        }
        catch (e) {
            switch (e.code) {
                case 'EEXIST':
                    console.error(`A directory called '${config.name}' already exists. Please create your function in a new directory.`);
                    break;
                case 'EACCES':
                    console.error(`You do not have permission to create files or directories in the path '${config.path}'.`);
                    break;
                default:
                    console.error(e.message);
            }
            return;
        }
        // Get account sid and auth token
        let accountDetails = yield import_credentials_1.default(config);
        if (Object.keys(accountDetails).length === 0) {
            accountDetails = yield prompt_1.promptForAccountDetails(config);
        }
        config = Object.assign({}, accountDetails, config);
        // Scaffold project
        const spinner = ora_1.default();
        spinner.start('Creating project directories and files');
        // await createDirectory(projectDir, 'functions');
        // await createDirectory(projectDir, 'assets');
        yield create_files_1.createEnvFile(projectDir, {
            accountSid: config.accountSid,
            authToken: config.authToken
        });
        yield create_files_1.createNvmrcFile(projectDir);
        yield create_files_1.createExampleFromTemplates(projectDir);
        yield create_files_1.createPackageJSON(projectDir, config.name);
        spinner.succeed();
        // Download .gitignore file from https://github.com/github/gitignore/
        spinner.start('Downloading .gitignore file');
        yield create_gitignore_1.default(projectDir);
        spinner.succeed();
        // Install dependencies with npm
        spinner.start('Installing dependencies');
        yield install_dependencies_1.installDependencies(projectDir);
        spinner.succeed();
        // Success message
        console.log(boxen_1.default(yield success_message_1.default(config), { padding: 1, borderStyle: 'round' }));
    });
}
exports.default = createTwilioFunction;
