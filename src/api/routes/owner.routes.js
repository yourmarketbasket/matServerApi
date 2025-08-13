const express = require('express');
const router = express.Router();
const OwnerAuthController = require('../controllers/owner.auth.controller');
const OwnerController = require('../controllers/owner.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public routes for owner signup
router.post('/signup', OwnerAuthController.signup);

// Protected routes for owner management
router.put('/:id/status', protect, authorize('P024'), OwnerController.updateOwnerStatus);


// Add other owner-specific routes here later

module.exports = router;
