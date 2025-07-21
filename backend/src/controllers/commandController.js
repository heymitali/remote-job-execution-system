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

// Get job status and details
const getJobController = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        error: 'Job not found',
        jobId
      });
    }
    
    res.json({
      success: true,
      job
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      error: 'Failed to retrieve job',
      message: error.message
    });
  }
};

// Get all jobs with pagination and filtering
const getJobsController = async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      status 
    } = req.query;
    
    const jobs = await Job.findAll(
      parseInt(limit), 
      parseInt(offset), 
      status
    );
    
    res.json({
      success: true,
      jobs,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: jobs.length
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      error: 'Failed to retrieve jobs',
      message: error.message
    });
  }
};

// Get job statistics
const getJobStatsController = async (req, res) => {
  try {
    const stats = await Job.getStats();
    
    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve job statistics',
      message: error.message
    });
  }
};

// Delete a job
const deleteJobController = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const deleted = await Job.delete(jobId);
    
    if (deleted) {
      res.json({
        success: true,
        message: `Job ${jobId} deleted successfully`
      });
    } else {
      res.status(404).json({
        error: 'Job not found',
        jobId
      });
    }

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      error: 'Failed to delete job',
      message: error.message
    });
  }
};

module.exports = {
  executeCommandController,
  cancelCommandController,
  getJobController,
  getJobsController,
  getJobStatsController,
  deleteJobController
};
