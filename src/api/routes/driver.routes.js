const express = require('express');
const router = express.Router();
const DriverController = require('../controllers/driver.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Publicly viewable list of drivers for a sacco
router.get('/:saccoId', DriverController.getDrivers);
// Anyone with access can view a driver's public performance data
router.get('/:id/performance', DriverController.getPerformance);

// Protected routes
const isSaccoOwnerOrSupport = authorize('sacco', 'owner', 'support_staff');
const isSaccoOrSupport = authorize('sacco', 'support_staff');

router.post('/', protect, isSaccoOwnerOrSupport, DriverController.createDriver);
router.put('/:id', protect, isSaccoOrSupport, DriverController.updateDriver);

module.exports = router;
