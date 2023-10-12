import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import * as dotenv from 'dotenv';
dotenv.config({  path: `${__dirname}.env` });

if (!process.env.OPENAI_API_KEY) throw new Error('Missing process.env.OPENAI_API_KEY variable');

import * as fs from 'fs';
import * as path from 'path';
import { Configuration, OpenAIApi } from 'openai';
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export const AIudame = (userPrompt) => {
  let prevCache;
  try {
    prevCache = fs.readFileSync(path.resolve(__dirname, './cache.json'), 'utf8');
  } catch (error) {
    prevCache = '[]';
  }
  const cacheJson = JSON.parse(prevCache);
  const existing = cacheJson.find((_) => _.prompt === argumentsStr);
  return new Promise((resolve, reject) => {
    if (existing) {
      resolve(existing.anwser);
    } else {
      openai.createCompletion({
        prompt: `
Assume that I am a software engineer. Answer this with code example if necessary:

${userPrompt}
`,
        // These config is the same one that uses https://platform.openai.com/codex-javascript-sandbox
        model: 'text-davinci-003',
        max_tokens: 1000,
        temperature: 0,
      })
        .then((_) => {
          resolve(_.data.choices[0].text.trim());
          cacheJson.push({
            prompt: argumentsStr,
            anwser: _.data.choices[0].text.trim(),
          });
          fs.writeFileSync(path.resolve(__dirname, './cache.json'), JSON.stringify(cacheJson, null, 2));
        })
        .catch((_) => reject(_));
    }
  });
};

