const express = require('express');
const router = express.Router();
const OwnerAuthController = require('../controllers/owner.auth.controller');

// Public routes for owner signup
router.post('/signup', OwnerAuthController.signup);

// Add other owner-specific routes here later

module.exports = router;
