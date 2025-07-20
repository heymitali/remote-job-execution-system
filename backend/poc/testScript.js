
// this script is just for POC

const { readFileSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');

const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('pwd', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '4.213.155.245',
  port: 22,
  username: 'mitali',
  privateKey: readFileSync(join(homedir(), '.ssh', '1753042297_244287'))
});
