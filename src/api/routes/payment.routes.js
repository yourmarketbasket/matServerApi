const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// A user must be logged in to initiate a payment
router.post('/', protect, PaymentController.createPayment);

// The confirmation endpoint is likely hit by a payment gateway webhook,
// so it may have different security (e.g., IP whitelist, signature verification).
// For now, it's left open.
router.put('/:id/confirm', PaymentController.confirmPayment);

// Protected routes for viewing payments
const canViewSaccoPayments = authorize('sacco', 'support_staff', 'superuser');
const canViewOwnerPayments = authorize('owner', 'support_staff', 'superuser');

router.get('/sacco/:saccoId', protect, canViewSaccoPayments, PaymentController.getSaccoPayments);
router.get('/owner/:id', protect, canViewOwnerPayments, PaymentController.getOwnerPayments);

module.exports = router;
