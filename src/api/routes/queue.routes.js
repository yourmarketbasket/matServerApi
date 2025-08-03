const express = require('express');
const router = express.Router();
const QueueController = require('../controllers/queue.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Publicly viewable queue for a route
router.get('/:routeId', QueueController.getQueues);

// Protected routes for Saccos and Support Staff
const isSaccoOrSupport = authorize('sacco', 'support_staff');
router.post('/', protect, isSaccoOrSupport, QueueController.createQueue);
router.delete('/:id', protect, isSaccoOrSupport, QueueController.deleteQueue);

module.exports = router;
