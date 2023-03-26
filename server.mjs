import * as fs from 'fs';
fs.readFileSync('./.env', 'utf8').split(/[\r\n]+/).forEach((_eachEnv) => {
  const parts = _eachEnv.split('=');
  process.env[parts[0]] = parts[1];
});

import * as path from 'path';
import express from 'express';
const app = express();
import bodyParser from 'body-parser';

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log.bind(req);
  res.sendFile(path.resolve('./index.html'));
});

import { Configuration, OpenAIApi } from 'openai';
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// create cache file if doesn't exists.
fs.stat('./cache.json', (err) => {
  if (err && err.code === 'ENOENT')
    fs.writeFileSync('./cache.json', '[]');
});

app.post('/aiudame-locoo', (req, res) => {
  const prevCache = fs.readFileSync('./cache.json', 'utf8');
  const cacheJson = JSON.parse(prevCache);
  const existing = cacheJson.find((_) => _.prompt === req.body.prompt);
  if (existing) {
    res.send({
      response: existing.anwser,
    });
    return;
  }
  openai.createCompletion({
    model: 'text-davinci-003',
    prompt: req.body.prompt,
    max_tokens: 250,
  })
    .then((_) => {
      res.send({
        response: _.data.choices[0].text,
      });
      cacheJson.push({
        prompt: req.body.prompt,
        anwser: _.data.choices[0].text,
      });
      fs.writeFileSync('cache.json', JSON.stringify(cacheJson, null, 2));
    })
    .catch((_) => { throw _; });
});

const port = process.env.PORT || 3000;
app.listen((port), () => {
  console.log(`App listening on port ${port}`);
});
