const {
  createPackageJSON,
  createDirectory,
  createExample,
  createEnvFile,
  createNvmrcFile,
  createJestSetupFile,
  createTestFiles
} = require('../src/create-twilio-function/create-files');
const versions = require('../src/create-twilio-function/versions');
const fs = require('fs');
const { promisify } = require('util');
const rimraf = promisify(require('rimraf'));
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const path = require('path');

const scratchDir = path.join(process.cwd(), 'scratch');

beforeAll(async () => {
  await rimraf(scratchDir);
});

beforeEach(async () => {
  await mkdir(scratchDir);
});

afterEach(async () => {
  await rimraf(scratchDir);
});

describe('createDirectory', () => {
  test('it creates a new directory with the project name', async () => {
    await createDirectory(scratchDir, 'test-project');
    const dir = await stat(path.join(scratchDir, 'test-project'));
    expect(dir.isDirectory());
  });

  test('it throws an error if the directory exists', async () => {
    await mkdir(path.join(scratchDir, 'test-project'));
    expect.assertions(1);
    try {
      await createDirectory(scratchDir, 'test-project');
    } catch (e) {
      expect(e.toString()).toMatch('EEXIST');
    }
  });
});

describe('createPackageJSON', () => {
  test('it creates a new package.json file with the name of the project', async () => {
    await createPackageJSON(scratchDir, 'project-name');
    const file = await stat(path.join(scratchDir, 'package.json'));
    expect(file.isFile());
    const packageJSON = JSON.parse(
      await readFile(path.join(scratchDir, 'package.json'))
    );
    expect(packageJSON.name).toEqual('project-name');
    expect(packageJSON.engines.node).toEqual(versions.node);
    expect(packageJSON.devDependencies['twilio-run']).toEqual(
      versions.twilioRun
    );
  });

  test('it rejects if there is already a package.json', async () => {
    fs.closeSync(fs.openSync(path.join(scratchDir, 'package.json'), 'w'));
    expect.assertions(1);
    try {
      await createPackageJSON(scratchDir, 'project-name');
    } catch (e) {
      expect(e.toString()).toMatch('file already exists');
    }
  });
});

describe('createExample', () => {
  const templatesDir = path.join(process.cwd(), 'example');
  test('it creates functions and assets directories', async () => {
    await createExample(scratchDir);

    const dirs = await readdir(scratchDir);
    const templateDirContents = await readdir(templatesDir);
    expect(dirs).toEqual(templateDirContents);
  });

  test('it copies the functions from the templates/functions directory', async () => {
    await createExample(scratchDir);

    const functions = await readdir(path.join(scratchDir, 'functions'));
    const templateFunctions = await readdir(
      path.join(templatesDir, 'functions')
    );
    expect(functions).toEqual(templateFunctions);
  });

  test('it rejects if there is already a functions directory', async () => {
    await mkdir(path.join(scratchDir, 'functions'));
    expect.assertions(1);
    try {
      await createExample(scratchDir);
    } catch (e) {
      expect(e.toString()).toMatch('file already exists');
    }
  });
});

describe('createEnvFile', () => {
  test('it creates a new .env file', async () => {
    await createEnvFile(scratchDir, {
      accountSid: 'AC123',
      authToken: 'qwerty123456'
    });
    const file = await stat(path.join(scratchDir, '.env'));
    expect(file.isFile());
    const contents = await readFile(path.join(scratchDir, '.env'), {
      encoding: 'utf-8'
    });
    expect(contents).toMatch('ACCOUNT_SID=AC123');
    expect(contents).toMatch('AUTH_TOKEN=qwerty123456');
  });

  test('it rejects if there is already an .env file', async () => {
    fs.closeSync(fs.openSync(path.join(scratchDir, '.env'), 'w'));
    expect.assertions(1);
    try {
      await createEnvFile(scratchDir, {
        accountSid: 'AC123',
        authToken: 'qwerty123456'
      });
    } catch (e) {
      expect(e.toString()).toMatch('file already exists');
    }
  });
});

describe('createNvmrcFile', () => {
  test('it creates a new .nvmrc file', async () => {
    await createNvmrcFile(scratchDir);
    const file = await stat(path.join(scratchDir, '.nvmrc'));
    expect(file.isFile());
    const contents = await readFile(path.join(scratchDir, '.nvmrc'), {
      encoding: 'utf-8'
    });
    expect(contents).toMatch(versions.node);
  });

  test('it rejects if there is already an .nvmrc file', async () => {
    fs.closeSync(fs.openSync(path.join(scratchDir, '.nvmrc'), 'w'));
    expect.assertions(1);
    try {
      await createNvmrcFile(scratchDir);
    } catch (e) {
      expect(e.toString()).toMatch('file already exists');
    }
  });
});

describe('createJestSetupFile', () => {
  test('it creates jest.setup.js', async () => {
    await createJestSetupFile('./scratch');
    const file = await stat('./scratch/jest.setup.js');
    expect(file.isFile());
  });
});

describe('createTestFiles', () => {
  beforeEach(async () => {
    await mkdir('./scratch/functions');
  });

  test('generates one test file per a function', async () => {
    fs.closeSync(fs.openSync('./scratch/functions/test-func.js', 'w'));
    fs.closeSync(fs.openSync('./scratch/functions/another-one.js', 'w'));
    await createTestFiles('./scratch/functions');

    const testFuncTest = await stat('./scratch/functions/test-func.test.js');
    expect(testFuncTest.isFile());

    const anotherOneTest = await stat('./scratch/functions/another-one.test.js');
    expect(anotherOneTest.isFile());
  });

  test('requires the right function in each testfile', async () => {
    fs.closeSync(fs.openSync('./scratch/functions/test-func.js', 'w'));
    fs.closeSync(fs.openSync('./scratch/functions/another-one.js', 'w'));
    await createTestFiles('./scratch/functions');

    const testFuncTestContents = await readFile('./scratch/functions/test-func.test.js', { encoding: 'utf-8' });
    expect(testFuncTestContents).toContain('require(\'./test-func\').handler');

    const anotherOneTestContents = await readFile('./scratch/functions/another-one.test.js', { encoding: 'utf-8' });
    expect(anotherOneTestContents).toContain('require(\'./another-one\').handler');
  });

  test('works recursively', async () => {
    await mkdir('./scratch/functions/sub');
    fs.closeSync(fs.openSync('./scratch/functions/test-func.js', 'w'));
    fs.closeSync(fs.openSync('./scratch/functions/sub/inner.js', 'w'));
    await createTestFiles('./scratch/functions');

    const testFuncTest = await stat('./scratch/functions/test-func.test.js');
    expect(testFuncTest.isFile());

    const innerTest = await stat('./scratch/functions/sub/inner.test.js');
    expect(innerTest.isFile());
  });
});
