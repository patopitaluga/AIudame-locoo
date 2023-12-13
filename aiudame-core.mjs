import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import * as dotenv from 'dotenv';
dotenv.config({  path: `${__dirname}.env` });

if (!process.env.OPENAI_API_KEY) throw new Error('Missing process.env.OPENAI_API_KEY variable');

import * as fs from 'fs';
import * as path from 'path';

import OpenAI from 'openai';
const openai = new OpenAI(); // process.env.OPENAI_API_KEY by default apiKey

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
      openai.chat.completions.create({
        messages: [{ role: 'user', content: `
        Assume that I am a software engineer. Answer this with code example if necessary:
        
        ${userPrompt}
        `.replace(/^ +/gm, '') }],
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        temperature: 0,
      })
        .then((_) => {
          const answer = _.choices[0].message.content.trim();
          resolve(answer);
          cacheJson.push({
            prompt: argumentsStr,
            anwser,
          });
          fs.writeFileSync(path.resolve(__dirname, './cache.json'), JSON.stringify(cacheJson, null, 2));
        })
        .catch((_) => reject(_));
    }
  });
};

