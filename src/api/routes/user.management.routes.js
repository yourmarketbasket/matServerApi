const express = require('express');
const router = express.Router();
const UserManagementController = require('../controllers/user.management.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes in this file are protected and for authorized users only
router.use(protect);

// Route to update a user's status
router.put(
  '/:id/status',
  authorize('P111'),
  UserManagementController.updateUserStatus
);

module.exports = router;
