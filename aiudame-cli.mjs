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

/**
 * @param {string} data -
 */
function pbcopy(data) {
  var proc = spawn('pbcopy');
  proc.stdin.write(data); proc.stdin.end();
}

let argumentsStr = '';
for (let i = 2; i < process.argv.length; i++) {
  argumentsStr += ' ' + process.argv[i];
}

console.log('\x1b[37m'); // color white
console.log('Thinking...');
console.log('\x1b[33m'); // color yellow

AIudame(argumentsStr)
  .then((_) => {
    console.log('');
    console.log(_);
    pbcopy(_);
    console.log('\x1b[0m'); // reset color
    console.log('copied ✔');
  })
  .catch((err) => console.log(err));
