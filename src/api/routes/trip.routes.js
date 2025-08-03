const express = require('express');
const router = express.Router();
const TripController = require('../controllers/trip.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Publicly viewable list of trips for a route
router.get('/:routeId', TripController.getTrips);

// Protected routes
const canManageTrips = authorize('sacco', 'driver', 'support_staff');
router.post('/', protect, canManageTrips, TripController.createTrip);
router.put('/:id/cancel', protect, canManageTrips, TripController.cancelTrip);
router.put('/:id/complete', protect, canManageTrips, TripController.completeTrip);

module.exports = router;
