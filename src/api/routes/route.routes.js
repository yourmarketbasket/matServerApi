const express = require('express');
const router = express.Router();
const RouteController = require('../controllers/route.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Public route to view available routes
router.get('/', RouteController.getRoutes);

// Protected routes for Saccos and Support Staff
const isSaccoOrSupport = authorize('sacco', 'support_staff');
router.post('/', protect, isSaccoOrSupport, RouteController.createRoute);
router.put('/:id', protect, isSaccoOrSupport, RouteController.updateRoute);
router.put('/:id/finalize', protect, isSaccoOrSupport, RouteController.finalizeRoute);
router.delete('/:id', protect, isSaccoOrSupport, RouteController.deleteRoute);

// Protected route for Saccos to adjust fares
router.post('/:id/fare-adjustment', protect, authorize('sacco'), RouteController.addFareAdjustment);

module.exports = router;
