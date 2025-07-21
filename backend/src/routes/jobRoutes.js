const express = require('express');
const {
  getJobController,
  getJobsController,
  getJobStatsController,
  deleteJobController,
} = require('../controllers/jobController');

const router = express.Router();

// Get job statistics
router.get('/stats', getJobStatsController);

// Get single job details
router.get('/:jobId', getJobController);

// Get all jobs with pagination and filtering
router.get('/', getJobsController);

// Delete a job
router.delete('/:jobId', deleteJobController);

module.exports = router;
