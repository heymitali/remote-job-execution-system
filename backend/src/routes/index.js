const express = require('express');
const commandRoutes = require('./commandRoutes');
const jobRoutes = require('./jobRoutes');

const router = express.Router();

// Mount command routes
router.use('/commands', commandRoutes);
router.use('/jobs', jobRoutes);

module.exports = router;
