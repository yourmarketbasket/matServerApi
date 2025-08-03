const express = require('express');
const router = express.Router();
const DiscountController = require('../controllers/discount.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Publicly viewable list of discounts for a sacco
router.get('/:saccoId', DiscountController.getDiscounts);

// Protected routes for Saccos to manage their own discounts
const isSacco = authorize('sacco');
router.post('/', protect, isSacco, DiscountController.createDiscount);
router.put('/:id', protect, isSacco, DiscountController.updateDiscount);
router.delete('/:id', protect, isSacco, DiscountController.deleteDiscount);

module.exports = router;
