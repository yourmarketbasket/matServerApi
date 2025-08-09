const express = require('express');
const router = express.Router();
const SuperuserController = require('../controllers/superuser.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public routes for superuser - registration and login are handled by AuthService now,
// but let's assume these are special endpoints for superuser creation/login.
// The permissions P001 and P003 are for the *ability* to perform these actions.
router.post('/register', SuperuserController.registerSuperuser);
router.post('/login', SuperuserController.loginSuperuser);

// force --- IGNORE ---

// All subsequent routes are protected
router.use(protect);

router.post('/staff', authorize('P009'), SuperuserController.createStaff);
router.put('/staff/:id', authorize('P010'), SuperuserController.updateStaff);
router.delete('/staff/:id', authorize('P011'), SuperuserController.deleteStaff);

router.get('/metrics', authorize('P012'), SuperuserController.getMetrics);

// For policy routes, we can check for any of the related permissions.
// E.g., a user who can set a policy might also be able to update/delete it.
router.post('/fare-policy', authorize('P013', 'P014', 'P015'), SuperuserController.setFarePolicy);
router.post('/system-fee', authorize('P016', 'P017', 'P018'), SuperuserController.setSystemFee);
router.post('/loyalty-policy', authorize('P019', 'P020', 'P021'), SuperuserController.setLoyaltyPolicy);

// Permission management routes
router.post('/permissions/sync', authorize('P111'), SuperuserController.syncPermissions);
router.get('/permissions', authorize('P111'), SuperuserController.getPermissions);
router.post('/permissions', authorize('P111'), SuperuserController.createPermission);
router.put('/permissions/:id', authorize('P111'), SuperuserController.updatePermission);
router.delete('/permissions/:id', authorize('P111'), SuperuserController.deletePermission);

module.exports = router;
