const express = require('express');
const router = express.Router();
const QueueController = require('../controllers/queue.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Publicly viewable queue for a route
router.get('/:routeId', QueueController.getQueues);

// Protected routes are now handled under /queue-managers/

module.exports = router;
