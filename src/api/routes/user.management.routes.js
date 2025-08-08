const express = require('express');
const router = express.Router();
const UserManagementController = require('../controllers/user.management.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes in this file are protected and for authorized users only
router.use(protect);

// Define User Management Routes
router.get('/', authorize('P112'), UserManagementController.getUsers);
router.get('/:id', authorize('P113'), UserManagementController.getUserById);
router.put('/:id/status', authorize('P111'), UserManagementController.updateUserStatus);
router.put('/:id/rank', authorize('P114'), UserManagementController.updateUserRank);
router.post('/:id/permissions', authorize('P115'), UserManagementController.addUserPermissions);
router.delete('/:id/permissions/:permission', authorize('P116'), UserManagementController.removeUserPermission);

module.exports = router;
