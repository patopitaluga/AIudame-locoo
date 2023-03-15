import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
fs.readFileSync(path.resolve(__dirname, './.env'), 'utf8').split(/[\r\n]+/).forEach((_eachEnv) => {
  const parts = _eachEnv.split('=');
  process.env[parts[0]] = parts[1];
});
import { spawn } from 'child_process';
function pbcopy(data) {
  var proc = spawn('pbcopy');
  proc.stdin.write(data); proc.stdin.end();
}

import { Configuration, OpenAIApi } from 'openai';
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// create cache file if doesn't exists.
fs.stat('./cache.json', (err) => {
  if (err && err.code === 'ENOENT')
    fs.writeFileSync('./cache.json', '[]');
});

console.log('\x1b[34m');
console.log('');

let argumentsStr = '';
for (let i = 2; i < process.argv.length; i++) {
  argumentsStr += ' ' + process.argv[i];
}

const prevCache = fs.readFileSync(path.resolve(__dirname, './cache.json'), 'utf8');
const cacheJson = JSON.parse(prevCache);
const existing = cacheJson.find((_) => _.prompt === argumentsStr);
if (existing) {
  console.log(existing.anwser);
  console.log('\x1b[0m');
  pbcopy(existing.anwser);
  console.log('copied ✔');
} else {
openai.createCompletion({
  model: 'text-davinci-003',
  prompt: argumentsStr,
  max_tokens: 150,
})
  .then((_) => {
    console.log(_.data.choices[0].text.trim());
    cacheJson.push({
      prompt: argumentsStr,
      anwser: _.data.choices[0].text.trim(),
    });
    fs.writeFileSync(path.resolve(__dirname, './cache.json'), JSON.stringify(cacheJson, null, 2));
    console.log('\x1b[0m');
    pbcopy(_.data.choices[0].text.trim());
    console.log('copied ✔');
  })
  .catch((_) => { throw _; });
}
