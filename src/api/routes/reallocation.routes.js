const express = require('express');
const router = express.Router();
const ReallocationController = require('../controllers/reallocation.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All reallocation routes are protected and restricted to support staff
const isSupport = authorize('support_staff', 'admin', 'superuser');
router.use(protect, isSupport);

router.post('/auto/:tripId', ReallocationController.autoReallocate);
router.post('/manual', ReallocationController.manualReallocate);

module.exports = router;
