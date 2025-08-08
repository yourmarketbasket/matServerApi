const express = require('express');
const router = express.Router();
const PermissionController = require('../controllers/permission.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes are protected and require authorization
router.use(protect);

// Routes for permissions
router.post('/', authorize('P117'), PermissionController.createPermission);
router.get('/', authorize('P118'), PermissionController.getPermissions);
router.get('/:id', authorize('P119'), PermissionController.getPermissionById);
router.put('/:id', authorize('P120'), PermissionController.updatePermission);
router.delete('/:id', authorize('P121'), PermissionController.deletePermission);

module.exports = router;
