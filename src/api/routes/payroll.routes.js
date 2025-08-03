const express = require('express');
const router = express.Router();
const PayrollController = require('../controllers/payroll.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes are protected
router.use(protect);

const canManagePayrolls = authorize('sacco', 'support_staff', 'superuser');
const canViewOwnerPayrolls = authorize('owner', 'sacco', 'support_staff', 'superuser');
const canViewDriverPayrolls = authorize('driver', 'sacco', 'support_staff', 'superuser');

router.post('/', canManagePayrolls, PayrollController.createPayroll);
router.get('/owner/:ownerId', canViewOwnerPayrolls, PayrollController.getOwnerPayrolls);
router.get('/driver/:driverId', canViewDriverPayrolls, PayrollController.getDriverPayrolls);
router.put('/:id/resolve', canManagePayrolls, PayrollController.resolvePayroll);

module.exports = router;
