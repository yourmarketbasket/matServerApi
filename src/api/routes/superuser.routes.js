const express = require('express');
const router = express.Router();
const SuperuserController = require('../controllers/superuser.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public routes for superuser
router.post('/register', SuperuserController.registerSuperuser);
router.post('/login', SuperuserController.loginSuperuser);

// All routes in this file are protected and restricted to superusers.
const isSuperuser = authorize('superuser');
router.use(protect, isSuperuser);

router.post('/staff', SuperuserController.createStaff);
router.put('/staff/:id', SuperuserController.updateStaff);
router.delete('/staff/:id', SuperuserController.deleteStaff);

router.get('/metrics', SuperuserController.getMetrics);

router.post('/fare-policy', SuperuserController.setFarePolicy);
router.post('/system-fee', SuperuserController.setSystemFee);
router.post('/loyalty-policy', SuperuserController.setLoyaltyPolicy);

module.exports = router;
