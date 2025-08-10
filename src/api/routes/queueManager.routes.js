const express = require('express');
const router = express.Router();
const QueueManagerAuthController = require('../controllers/queueManager.auth.controller');

// Public routes for QueueManager signup and login
router.post('/signup', QueueManagerAuthController.signup);
router.post('/login', QueueManagerAuthController.login);

// Add other QueueManager-specific routes here later

module.exports = router;
