const { 
  executeCommand,
  cancelCommand,
} = require('../utils/sshConnect');
const Job = require('../models/Job');
const uuid = require('uuid');

const executeCommandController = async (req, res) => {
  try {
    const { command } = req.body;
    
    if (!command) {
      return res.status(400).json({
        error: 'Command is required'
      });
    }
    
    const jobId = uuid.v4(); // Generate a unique job ID for tracking
    
    // Create job entry in database
    await Job.create({ id: jobId, command });
    
    // Execute command asynchronously
    executeCommand(jobId, command)
      .then(result => {
        console.log(`Job ${jobId} completed successfully`);
      })
      .catch(error => {
        console.error(`Job ${jobId} failed:`, error.message);
      });

    res.json({
      success: true,
      jobId,
      message: 'Command execution started',
      status: 'pending'
    });

  } catch (error) {
    console.error('Execute command error:', error);
    res.status(500).json({
      error: 'Failed to execute command',
      message: error.message
    });
  }
};

const cancelCommandController = async (req, res) => {
  try {
    const { jobId } = req.body;
    
    if (!jobId) {
      return res.status(400).json({
        error: 'Job ID is required'
      });
    }
    
    const cancelled = await cancelCommand(jobId);

    if (cancelled) {
      res.json({
        success: true,
        message: `Command cancelled for job: ${jobId}`
      });
    } else {
      res.status(404).json({
        error: 'No active command found to cancel',
        jobId
      });
    }

  } catch (error) {
    console.error('Cancel command error:', error);
    res.status(500).json({
      error: 'Failed to cancel command',
      message: error.message
    });
  }
};

module.exports = {
  executeCommandController,
  cancelCommandController,
};
