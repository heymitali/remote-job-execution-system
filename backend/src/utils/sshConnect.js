const { readFileSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');
const { Client } = require('ssh2');

// Store single connection and stream
let connection = null;
let activeStreams = new Map();

const createConnection = async () => {
  // If connection already exists and is ready, return it
  if (connection && connection._sock && connection._sock.readable) {
    console.log('Reusing existing connection');
    return connection;
  }

  const conn = new Client();
  
  const connectionConfig = {
    host: process.env.SSH_HOST,
    port: process.env.SSH_PORT,
    username: process.env.SSH_USERNAME,
    privateKey: readFileSync(join(homedir(), '.ssh', process.env.SSH_PRIVATE_KEY_FILE))
  };

  return new Promise((resolve, reject) => {
    conn.on('ready', () => {
      console.log('Connection ready');
      connection = conn;
      resolve(conn);
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      connection = null;
      reject(err);
    });

    conn.on('close', () => {
      console.log('Connection closed');
      connection = null;
      activeStream = null;
    });

    conn.connect(connectionConfig);
  });
};

const executeCommand = async (job_id, command) => {
  // Ensure connection exists
  if (!connection) {
    await createConnection();
  }

  return new Promise((resolve, reject) => {
    connection.exec(command, (err, stream) => {
      if (err) {
        reject(err);
        return;
      }

      let stdout = '';
      let stderr = '';

      stream.on('close', (code, signal) => {
        console.log(`Command execution completed :: code: ${code}, signal: ${signal}`);
        activeStream = null;
        resolve({
          code,
          signal,
          stdout: stdout.trim(),
          stderr: stderr.trim()
        });
      });

      stream.on('data', (data) => {
        stdout += data.toString();
      });

      stream.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Store stream reference for potential cancellation
      activeStreams.set(job_id, stream);
    });
  });
};

const cancelCommand = (job_id) => {
  const stream = activeStreams.get(job_id);
  if (stream) {
    stream.signal('KILL');
    activeStreams.delete(job_id);
    return true;
  }
  
  return false;
};

const closeConnection = () => {
  if (connection) {
    connection.end();
    connection = null;
    activeStream = null;
    return true;
  }
  
  return false;
};

const isConnectionActive = () => {
  return connection && connection._sock && connection._sock.readable;
};

module.exports = {
  createConnection,
  executeCommand,
  cancelCommand,
  closeConnection,
  isConnectionActive
};
