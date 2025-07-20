const express = require('express');
const commandRoutes = require('./commandRoutes');

const router = express.Router();

// Mount command routes
router.use('/commands', commandRoutes);

module.exports = router;
