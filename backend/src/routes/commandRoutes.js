const express = require('express');
const {
  executeCommandController,
  cancelCommandController,
} = require('../controllers/commandController');

const router = express.Router();

// Execute command API
router.post('/execute', executeCommandController);

// Cancel command API
router.post('/cancel', cancelCommandController);

module.exports = router;
