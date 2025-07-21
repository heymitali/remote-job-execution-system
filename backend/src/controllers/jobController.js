const Job = require('../models/Job');
const uuid = require('uuid');

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
  getJobController,
  getJobsController,
  getJobStatsController,
  deleteJobController
};
