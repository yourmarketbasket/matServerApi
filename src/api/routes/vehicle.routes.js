const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicle.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public route to view vehicles for a Sacco
router.get('/:saccoId', VehicleController.getVehicles);

// Protected routes are now handled under /saccos/vehicles

module.exports = router;
