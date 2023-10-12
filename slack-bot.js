import * as dotenv from 'dotenv';
dotenv.config();
import { AIudame } from './aiudame-core.mjs';
import pkg from '@slack/bolt';
const { App, /* LogLevel */ } = pkg;

if (!process.env.SLACK_SIGNING_SECRET) throw new Error('Missing env var SLACK_SIGNING_SECRET');
if (!process.env.SLACK_BOT_TOKEN) throw new Error('Missing env var SLACK_BOT_TOKEN');
if (!process.env.SLACK_APP_TOKEN) throw new Error('Missing env var SLACK_APP_TOKEN±±§§');

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
  // logLevel: LogLevel.DEBUG,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

app.command('/aiudame', async ({ command, ack, respond }) => {
  ack();
  await respond({ response_type: 'in_channel', text: `*@${command.user_name}* asked: ${command.text}`, });
  respond({ response_type: 'in_channel', text: '*Thinking...*', });
  AIudame(command.text)
    .then((_) => {
      respond({ response_type: 'in_channel', text: '```\n' + _ + '```', });
    })
    .catch((err) => console.log(err));
});

(async () => {
  await app.start(process.env.PORT || 9997);

  console.log('⚡️ AIudate slack bot app is running in port ' + (process.env.PORT || 9997));
})();
