const express = require('express');
const router = express.Router();
const PassengerAuthController = require('../controllers/passenger.auth.controller');
const PassengerController = require('../controllers/passenger.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes for passenger signup
router.post('/signup', PassengerAuthController.signup);

// --- Protected Routes ---

// Ticket creation
router.post('/tickets', protect, PassengerController.createTicket);


// Other passenger-specific routes can be added here later
// For example, getting profile, updating profile, etc.


module.exports = router;
