const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
router.post('/superuser/register', AuthController.registerSuperuser);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

// Protected routes for MFA management
router.post('/mfa/setup', protect, AuthController.setupMFA);
router.post('/mfa/verify', protect, AuthController.verifyMFA);

module.exports = router;
