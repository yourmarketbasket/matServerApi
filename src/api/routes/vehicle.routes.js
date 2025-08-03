const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicle.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public route to view vehicles for a Sacco
router.get('/:saccoId', VehicleController.getVehicles);

// Protected routes for Saccos and Support Staff
const isSaccoOrSupport = authorize('sacco', 'support_staff');
router.post('/', protect, isSaccoOrSupport, VehicleController.createVehicle);
router.put('/:id', protect, isSaccoOrSupport, VehicleController.updateVehicle);
router.delete('/:id', protect, isSaccoOrSupport, VehicleController.deleteVehicle);

module.exports = router;
