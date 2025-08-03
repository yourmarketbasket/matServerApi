const express = require('express');
const router = express.Router();
const SupportController = require('../controllers/support.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes are protected
router.use(protect);

const isSupportAdmin = authorize('support_staff', 'admin', 'superuser');

// Any authenticated user can create an inquiry
router.post('/inquiries', SupportController.createInquiry);

// Only support staff and admins can manage inquiries and escalations
router.get('/inquiries', isSupportAdmin, SupportController.getInquiries);
router.put('/inquiries/:id', isSupportAdmin, SupportController.updateInquiry);
router.post('/escalations', isSupportAdmin, SupportController.createEscalation);

module.exports = router;
