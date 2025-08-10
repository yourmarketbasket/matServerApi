const express = require('express');
const router = express.Router();
const PassengerAuthController = require('../controllers/passenger.auth.controller');

// Public routes for passenger signup and login
router.post('/signup', PassengerAuthController.signup);
router.post('/login', PassengerAuthController.login);

// Other passenger-specific routes can be added here later
// For example, getting profile, updating profile, etc.
// These would be protected routes.
// e.g., router.get('/profile', protect, PassengerController.getProfile);


module.exports = router;
