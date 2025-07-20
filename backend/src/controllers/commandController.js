const { 
  executeCommand,
  cancelCommand,
} = require('../utils/sshConnect');
const uuid = require('uuid');

const executeCommandController = async (req, res) => {
  try {
    const { command } = req.body;
    const jobId = uuid.v4(); // Generate a unique job ID for tracking
    const result = await executeCommand(jobId, command);

    res.json({
      success: true,
      jobId,
      result
    });

  } catch (error) {
    console.error('Execute command error:', error);
    res.status(500).json({
      error: 'Failed to execute command',
      message: error.message
    });
  }
};

const cancelCommandController = (req, res) => {
  try {
    const { jobId } = req.body;
    const cancelled = cancelCommand(jobId);

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
  cancelCommandController
};
