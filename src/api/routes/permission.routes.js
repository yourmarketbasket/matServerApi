const express = require('express');
const router = express.Router();
const PermissionController = require('../controllers/permission.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes are protected and require authorization
router.use(protect);

// Routes for permissions
router.post('/', authorize('P117'), PermissionController.createPermissions);
router.get('/', authorize('P118'), PermissionController.getPermissions);
router.get('/:permissionNumber', authorize('P119'), PermissionController.getPermissionByNumber);
router.put('/:permissionNumber', authorize('P120'), PermissionController.updatePermissionByNumber);
router.delete('/:permissionNumber', authorize('P121'), PermissionController.deletePermissionByNumber);

module.exports = router;
