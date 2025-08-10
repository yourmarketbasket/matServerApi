const express = require('express');
const router = express.Router();
const LoyaltyController = require('../controllers/loyalty.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All loyalty routes are protected
router.use(protect);

// Earning and redeeming points could be triggered by other services,
// but we can expose endpoints for manual adjustments or specific actions.
const isSupport = authorize('support_staff', 'admin', 'superuser');
router.post('/earn', isSupport, LoyaltyController.earnPoints);
router.post('/redeem', isSupport, LoyaltyController.redeemPoints);


// A user should only be able to see their own loyalty status
const canViewOwnLoyalty = (req, res, next) => {
    if (req.staff.id === req.params.userId || ['admin', 'superuser', 'support_staff'].includes(req.staff.role)) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden' });
};
router.get('/:userId', canViewOwnLoyalty, LoyaltyController.getLoyalty);

module.exports = router;
