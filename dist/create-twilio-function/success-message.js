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
const pkg_install_1 = require("pkg-install");
const chalk_1 = require("chalk");
function successMessage(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageManager = yield pkg_install_1.getPackageManager({ cwd: process.cwd() });
        return chalk_1.default `{green Success!}

  Created {bold ${config.name}} at ${config.path}

  Inside that directory, you can run the following command:

  {blue ${packageManager} start}
    Serves all functions in the ./functions subdirectory and assets in the
    ./assets directory

  Get started by running:

  {blue cd ${config.name}}
  {blue ${packageManager} start}`;
    });
}
exports.default = successMessage;
