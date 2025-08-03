const express = require('express');
const router = express.Router();
const SaccoController = require('../controllers/sacco.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// Middleware for routes accessible only by support staff
const isSupport = authorize('support_staff');
// Middleware for routes accessible by support staff or superusers
const isSupportOrSuperuser = authorize('support_staff', 'superuser');

router.get('/', protect, isSupportOrSuperuser, SaccoController.getSaccos);

router.post('/', protect, isSupport, SaccoController.createSacco);
router.put('/:id', protect, isSupport, SaccoController.updateSacco);
router.put('/:id/approve', protect, isSupport, SaccoController.approveSacco);
router.put('/:id/reject', protect, isSupport, SaccoController.rejectSacco);
router.delete('/:id', protect, isSupport, SaccoController.deleteSacco);

module.exports = router;
