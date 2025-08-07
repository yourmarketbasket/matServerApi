const express = require('express');
const router = express.Router();
const DriverController = require('../controllers/driver.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Saccos and Owners should be able to see drivers.
router.get('/:saccoId', protect, authorize('P062', 'P086'), DriverController.getDrivers);
// Saccos can view driver performance
router.get('/:id/performance', protect, authorize('P065'), DriverController.getPerformance);

// Saccos and Owners can onboard drivers
router.post('/', protect, authorize('P062', 'P086'), DriverController.createDriver);
// Saccos can update driver details
router.put('/:id', protect, authorize('P064'), DriverController.updateDriver);

module.exports = router;
