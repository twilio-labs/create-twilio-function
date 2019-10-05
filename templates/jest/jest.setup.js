const fs = require('fs');
const path = require('path');
const Twilio = require('Twilio');

require('dotenv').config();

class Response {
  constructor() {
    this._body = {};
    this._headers = {};
  }

  setBody(body) {
    this._body = body;
  }

  appendHeader(key, value) {
    this._headers[key] = value;
  }
}

const cleanFileName = fileName => fileName.replace('.private.', '.');

const runtimeListFiles = directory =>
  fs
    .readdirSync(path.join(__dirname, directory))
    .reduce((prev, file) => ({
      ...prev,
      [`/${cleanFileName(file)}`]: { path: path.join(__dirname, directory, file) }
    }), {})

beforeAll(() => {
  global.Twilio = Twilio;
  global.Twilio.Response = Response;
  global.twilioClient = new Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
  global.Runtime = {
    getAssets: () => runtimeListFiles('assets'),
    getFunctions: () => runtimeListFiles('functions')
  };
});

afterAll(() => {
  delete global.Twilio;
  delete global.twilioClient;
  delete global.Runtime;
});
