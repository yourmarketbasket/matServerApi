const express = require('express');
const router = express.Router();
const VehicleController = require('../controllers/vehicle.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public route to view vehicles for a Sacco
router.get('/:saccoId', VehicleController.getVehicles);

// Protected routes for owners to manage their vehicles
router.post('/owner', protect, VehicleController.createVehicleForOwner);
router.get('/owner', protect, VehicleController.getVehiclesByOwner);
router.put('/owner/:id', protect, VehicleController.updateVehicleAsOwner);
router.delete('/owner/:id', protect, VehicleController.deleteVehicleAsOwner);
router.put('/owner/:id/status', protect, VehicleController.updateVehicleStatusAsOwner);


// Protected routes for Saccos are handled under /saccos/vehicles

module.exports = router;
