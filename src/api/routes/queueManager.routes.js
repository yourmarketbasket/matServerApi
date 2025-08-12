const express = require('express');
const router = express.Router();
const QueueManagerController = require('../controllers/queueManager.controller');
const QueueManagerAuthController = require('../controllers/queueManager.auth.controller');

// Public routes for QueueManager signup
router.post('/signup', QueueManagerAuthController.signup);

const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// --- Protected Routes ---
router.post('/add-trip', protect, authorize('P089'), QueueManagerController.addTripToQueue);
router.delete('/remove-trip/:id', protect, authorize('P089'), QueueManagerController.removeTripFromQueue);


module.exports = router;
