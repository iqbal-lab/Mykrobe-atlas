/* @flow */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
const pkg = require('../package.json');
const del = require('del');
import { escapePath } from './util';

let command, folder;

const executeCommand = command => {
  console.log(command);
  execSync(command, { stdio: [0, 1, 2] });
};

const BASE_PATH = path.join(__dirname, 'predictor-binaries/Mykrobe-predictor');
// checkout repo or pull if it already exists

folder = BASE_PATH;
if (!fs.existsSync(path.join(folder, '.git'))) {
  command = `git clone --recursive -b add-model-to-output git@github.com:iqbal-lab/Mykrobe-predictor.git ${escapePath(
    folder
  )}`;
} else {
  command = `cd ${escapePath(
    folder
  )} && git pull && git submodule update --init --recursive`;
}
executeCommand(command);

// make mccortex

folder = path.join(BASE_PATH, 'mccortex');
command = `cd ${escapePath(folder)} && make`;
executeCommand(command);

// install atlas

// command = `pip install git+https://github.com/Phelimb/atlas`;
// executeCommand(command);

// build predictor

folder = path.join(BASE_PATH, 'dist');
command = `cd ${escapePath(
  folder
)} && pyinstaller --noconfirm --workpath=./pyinstaller_build/binary_cache --distpath=./pyinstaller_build mykrobe_predictor_pyinstaller.spec`;
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
  command = `cp -r ${escapePath(`${sourceFolder}/`)} ${escapePath(destFolder)}`;
  executeCommand(command);
  console.log('done!');
});
