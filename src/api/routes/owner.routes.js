const express = require('express');
const router = express.Router();
const OwnerAuthController = require('../controllers/owner.auth.controller');

// Public routes for owner signup and login
router.post('/signup', OwnerAuthController.signup);
router.post('/login', OwnerAuthController.login);

// Add other owner-specific routes here later

module.exports = router;
