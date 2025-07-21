const express = require('express');
const {
  executeCommandController,
  cancelCommandController,
  getJobController,
  getJobsController,
  getJobStatsController,
  deleteJobController,
} = require('../controllers/commandController');

const router = express.Router();

// Execute command API
router.post('/execute', executeCommandController);

// Cancel command API
router.post('/cancel', cancelCommandController);

// Get single job details
router.get('/jobs/:jobId', getJobController);

// Get all jobs with pagination and filtering
router.get('/jobs', getJobsController);

// Get job statistics
router.get('/jobs-stats', getJobStatsController);

// Delete a job
router.delete('/jobs/:jobId', deleteJobController);

module.exports = router;
