import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
fs.readFileSync(path.resolve(__dirname, './.env'), 'utf8').split(/[\r\n]+/).forEach((_eachEnv) => {
  const parts = _eachEnv.split('=');
  process.env[parts[0]] = parts[1];
});
import { spawn } from 'child_process';
import { AIudame } from './aiudame-core.mjs';

import inquirer from 'inquirer';

/**
 * @param {string} data -
 */
function pbcopy(data) {
  var proc = spawn('pbcopy');
  proc.stdin.write(data); proc.stdin.end();
}

const onePrompt = () => {
  inquirer
    .prompt([
      {
        name: 'userPrompt',
        message: 'Write your question'
      },
    ])
    .then(answers => {
      console.log('\x1b[37m'); // color white
      console.log('Thinking...');
      console.log('\x1b[33m'); // color yellow

      const argumentsStr = answers.userPrompt;

      let outputToFile = false;
      if (argumentsStr.startsWith('create a file with')) {
        outputToFile = true;
        argumentsStr = argumentsStr.substr('create a file with'.length);
      }

      if (argumentsStr.match(/(?: in this file: )(.*)/) || argumentsStr.match(/(?: in this file )(.*)/)) { // with or without :
        let fileName;
        if (fs.existsSync(argumentsStr.substr(argumentsStr.indexOf(' in this file: ') + ' in this file: '.length))) fileName = argumentsStr.substr(argumentsStr.indexOf(' in this file: ') + ' in this file: '.length);
        if (fs.existsSync(argumentsStr.substr(argumentsStr.indexOf(' in this file ') + ' in this file '.length))) fileName = argumentsStr.substr(argumentsStr.indexOf(' in this file ') + ' in this file '.length);
        if (!fileName) throw new Error('File not found');
        const fileContent = fs.readFileSync(fileName, 'utf8');
        argumentsStr = `
      Considering this script:

      ${fileContent}

      `+ argumentsStr;
      }

      AIudame(argumentsStr)
        .then((_) => {
          if (outputToFile) {
            fs.writeFileSync('output.js', _);
            console.log('');
            console.log('output.js file created');
            console.log('\x1b[0m'); // reset color
            return;
          }
          console.log('');
          console.log(_);
          pbcopy(_);
          console.log('\x1b[0m'); // reset color
          console.log('copied ✔');

          setTimeout(() => onePrompt(), 2000)
        })
        .catch((err) => console.log(err));
    });
}
onePrompt();
