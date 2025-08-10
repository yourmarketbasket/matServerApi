const express = require('express');
const router = express.Router();
const TripController = require('../controllers/trip.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Publicly viewable list of trips for a route
router.get('/:routeId', TripController.getTrips);

// Protected routes


module.exports = router;
