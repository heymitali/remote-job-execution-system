const { readFileSync } = require('fs');
const { homedir } = require('os');
const { join } = require('path');
const { Client } = require('ssh2');
const Job = require('../models/Job');

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
  try {
    // Update job status to running
    await Job.updateStatus(job_id, 'running');
    
    // Ensure connection exists
    if (!connection) {
      await createConnection();
    }

    return new Promise((resolve, reject) => {
      connection.exec(command, async (err, stream) => {
        if (err) {
          // Update job status to failed with error
          await Job.updateStatus(job_id, 'failed', {
            error_message: err.message
          });
          reject(err);
          return;
        }

        let stdout = '';
        let stderr = '';

        stream.on('close', async (code, signal) => {
          console.log(`Command execution completed :: code: ${code}, signal: ${signal}`);
          activeStreams.delete(job_id);
          
          // Determine status based on exit code
          let status = code === 0 ? 'completed' : 'failed';
          if (signal == 'SIGKILL') {
            status = 'cancelled';
          }
          
          // Update job with results
          await Job.updateStatus(job_id, status, {
            output_stdout: stdout.trim(),
            output_stderr: stderr.trim(),
            exit_code: code || -1,
            signal_code: signal || -1
          });
          
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

        stream.on('error', async (error) => {
          console.error('Stream error:', error);
          activeStreams.delete(job_id);
          
          // Update job status to failed
          await Job.updateStatus(job_id, 'failed', {
            error_message: error.message,
            output_stderr: stderr.trim()
          });
          
          reject(error);
        });

        // Store stream reference for potential cancellation
        activeStreams.set(job_id, stream);
      });
    });
  } catch (error) {
    // Update job status to failed if any error occurs
    await Job.updateStatus(job_id, 'failed', {
      error_message: error.message
    });
    throw error;
  }
};

const cancelCommand = async (job_id) => {
  const stream = activeStreams.get(job_id);
  if (stream) {
    stream.signal('KILL');
    activeStreams.delete(job_id);
    
    // Update job status to cancelled
    await Job.updateStatus(job_id, 'cancelled');
    
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
