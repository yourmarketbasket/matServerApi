const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All analytics routes are protected
router.use(protect);

const canViewSaccoAnalytics = authorize('sacco', 'support_staff', 'superuser');
const canViewOwnerAnalytics = authorize('owner', 'sacco', 'support_staff', 'superuser');
// A user should only be able to see their own loyalty usage
const canViewOwnLoyalty = (req, res, next) => {
    if (req.user.id === req.params.userId || ['admin', 'superuser'].includes(req.user.role)) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Forbidden' });
};


router.get('/revenue/sacco/:saccoId', canViewSaccoAnalytics, AnalyticsController.getSaccoRevenue);
router.get('/revenue/owner/:ownerId', canViewOwnerAnalytics, AnalyticsController.getOwnerRevenue);
router.get('/cancellations/:routeId', canViewSaccoAnalytics, AnalyticsController.getCancellationStats);
router.get('/payroll/:saccoId', canViewSaccoAnalytics, AnalyticsController.getPayrollAccuracy);
router.get('/loyalty/:userId', canViewOwnLoyalty, AnalyticsController.getLoyaltyUsage);
router.get('/registrations', authorize('admin', 'superuser'), AnalyticsController.getUserRegistrationStats);

module.exports = router;
