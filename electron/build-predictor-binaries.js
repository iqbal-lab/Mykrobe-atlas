/* @flow */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
const pkg = require('../package.json');
const del = require('del');

let command, folder;

const ENV_HOME = process.env.HOME;
const IS_CYGWIN = !!/cygwin/.test(ENV_HOME);

const executeCommand = command => {
  console.log(command);
  execSync(command, { stdio: [0, 1, 2] });
};

const BASE_PATH = path.join(__dirname, 'predictor-binaries/Mykrobe-predictor');
// checkout repo or pull if it already exists

folder = BASE_PATH;
if (!fs.existsSync(path.join(folder, '.git'))) {
  if (IS_CYGWIN) {
    // git will be relative to the current folder on cygwin
    command = `git clone --recursive -b add-model-to-output git@github.com:iqbal-lab/Mykrobe-predictor.git "electron/predictor-binaries/Mykrobe-predictor"`;
  } else {
    // can clone into the absolute folder
    command = `git clone --recursive -b add-model-to-output git@github.com:iqbal-lab/Mykrobe-predictor.git "${BASE_PATH}"`;
  }
  executeCommand(command);
} else {
  command = `cd "${folder}" && git pull && git submodule update --init --recursive`;
  executeCommand(command);
}

// patch ./mccortex/libs/xxHash/xxhsum.c https://github.com/iqbal-lab/Mykrobe-predictor/tree/master/dist

const patchFile = path.join(BASE_PATH, 'mccortex/libs/xxHash/xxhsum.c');
const unpatched = fs.readFileSync(patchFile, 'utf8');
const patched = unpatched.replace(/ \|\| defined\(__CYGWIN__\)/g, '');
if (patched !== unpatched) {
  console.log('patching ./mccortex/libs/xxHash/xxhsum.c');
  fs.writeFileSync(patchFile, patched);
}

// make mccortex

folder = path.join(BASE_PATH, 'mccortex');
command = `cd "${folder}" && make`;
executeCommand(command);

// install atlas

// command = `pip install git+https://github.com/Phelimb/atlas`;
// executeCommand(command);

// build predictor

folder = path.join(BASE_PATH, 'dist');
command = `cd "${folder}" && pyinstaller --noconfirm --workpath=./pyinstaller_build/binary_cache --distpath=./pyinstaller_build mykrobe_predictor_pyinstaller.spec`;
executeCommand(command);

// copy files

const plat = os.platform();
const arch = os.arch();

const sourceFolder = path.join(
  BASE_PATH,
  'dist/pyinstaller_build/mykrobe_predictor'
);
const destFolder = path.join(
  __dirname,
  `resources/bin/${pkg.targetName}/${plat}-${arch}/bin`
);

del([
  `${destFolder}/**`,
  `!${destFolder}`,
  `!${destFolder}/.gitignore`,
]).then(() => {
  // command = `cp -r "${sourceFolder}/" "${destFolder}"`;
  // executeCommand(command);
  fs.copySync(sourceFolder, destFolder);
  console.log('done!');
});
