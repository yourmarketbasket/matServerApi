const express = require('express');
const router = express.Router();
const UserManagementController = require('../controllers/user.management.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes in this file are protected and for authorized users only
router.use(protect);

// Route to get all users
router.get('/', authorize('P112'), UserManagementController.getUsers);

// Route to get a single user
router.get('/:id', authorize('P113'), UserManagementController.getUserById);

// Route to update a user's status
router.put(
  '/:id/status',
  authorize('P111'),
  UserManagementController.updateUserStatus
);

// Route to update a user's rank
router.put(
  '/:id/rank',
  authorize('P114'),
  UserManagementController.updateUserRank
);

// Route to add a permission to a user
router.post(
  '/:id/permissions',
  authorize('P115'),
  UserManagementController.addUserPermission
);

// Route to remove a permission from a user
router.delete(
  '/:id/permissions/:permission',
  authorize('P116'),
  UserManagementController.removeUserPermission
);

module.exports = router;
