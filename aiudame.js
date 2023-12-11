#!/usr/bin/env node
// This file is to get a easy terminal interface e.g. "node auidame something". The core will be in aiudame-core.js
const { spawnSync } = require('child_process');
const { resolve } = require('path');

let argumentsStr = '';
for (let i = 2; i < process.argv.length; i++) {
  argumentsStr += ' ' + process.argv[i];
}

if (argumentsStr.trim().startsWith('continuous')) {
  let cmd = 'node --experimental-modules --no-warnings ' + resolve(__dirname, 'aiudame-continuous.mjs' + argumentsStr);
  spawnSync(cmd, { stdio: 'inherit', shell: true });
} else {
  let cmd = 'node --experimental-modules --no-warnings ' + resolve(__dirname, 'aiudame-cli.mjs' + argumentsStr);
  cmd = cmd.replace(RegExp('"', 'g'), '\\"');
  spawnSync(cmd, { stdio: 'inherit', shell: true });
}
