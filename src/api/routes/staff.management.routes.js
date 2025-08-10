const express = require('express');
const router = express.Router();
const StaffManagementController = require('../controllers/staff.management.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes in this file are protected and for authorized staff only
router.use(protect);

// Define Staff Management Routes
router.get('/', authorize('P112'), StaffManagementController.getStaff);
router.get('/admins', authorize('P112'), StaffManagementController.getAdminStaff);
router.get('/:id', authorize('P113'), StaffManagementController.getStaffById);
router.put('/:id/status', authorize('P111'), StaffManagementController.updateStaffStatus);
router.put('/:id/rank', authorize('P114'), StaffManagementController.updateStaffRank);
router.post('/:id/permissions', authorize('P115'), StaffManagementController.addStaffPermissions);
router.delete('/:id/permissions/:permission', authorize('P116'), StaffManagementController.removeStaffPermission);

// Route for remote logout
router.post('/remote-logout', authorize('P117'), StaffManagementController.remoteLogout);

module.exports = router;
