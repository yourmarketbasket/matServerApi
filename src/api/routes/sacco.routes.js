const express = require('express');
const router = express.Router();
const SaccoController = require('../controllers/sacco.controller');
const SaccoAuthController = require('../controllers/sacco.auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public routes for Sacco signup and login
router.post('/signup', SaccoAuthController.signup);
router.post('/login', SaccoAuthController.login);


// Protected Sacco routes
// Let's assume viewing saccos requires the same permission as adding one.
router.get('/', protect, authorize('P023'), SaccoController.getSaccos);

router.post('/', protect, authorize('P023'), SaccoController.createSacco);
router.put('/:id', protect, authorize('P024'), SaccoController.updateSacco);
router.put('/:id/approve', protect, authorize('P026'), SaccoController.approveSacco);
router.put('/:id/reject', protect, authorize('P027'), SaccoController.rejectSacco);
router.delete('/:id', protect, authorize('P025'), SaccoController.deleteSacco);


// --- Routes for Sacco to manage their own Routes ---
router.post('/routes', protect, authorize('P051'), SaccoController.createRoute);
router.put('/routes/:id', protect, authorize('P052'), SaccoController.updateRoute);
router.put('/routes/:id/finalize', protect, authorize('P054'), SaccoController.finalizeRoute);
router.delete('/routes/:id', protect, authorize('P053'), SaccoController.deleteRoute);
router.post('/routes/:id/fare-adjustment', protect, authorize('P055'), SaccoController.addFareAdjustment);

// --- Routes for Sacco to manage their own Vehicles ---
router.post('/vehicles', protect, authorize('P056'), SaccoController.createVehicle);
router.put('/vehicles/:id', protect, authorize('P057'), SaccoController.updateVehicle);
router.delete('/vehicles/:id', protect, authorize('P058'), SaccoController.deleteVehicle);


module.exports = router;
