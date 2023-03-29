import * as fs from 'fs';
fs.readFileSync('./.env', 'utf8').split(/[\r\n]+/).forEach((_eachEnv) => {
  const parts = _eachEnv.split('=');
  process.env[parts[0]] = parts[1];
});

import * as path from 'path';
import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import { AIudame } from './aiudame-core.mjs';

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log.bind(req);
  res.sendFile(path.resolve('./index.html'));
});

app.post('/aiudame-locoo', (req, res) => {
  AIudame(req.body.prompt)
    .then((_) => {
      res.send({
        response: _,
      });
    })
    .catch((err) => {
      res.send({
        response: 'Api not available.',
      });
      console.log(err)
    });
});

const port = process.env.PORT || 3333;
app.listen((port), () => {
  console.log(`App listening on port ${port}`);
});
