const express = require('express');
const router = express.Router();
const SaccoController = require('../controllers/sacco.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes are protected
router.use(protect);

// Let's assume viewing saccos requires the same permission as adding one.
router.get('/', authorize('P023'), SaccoController.getSaccos);

router.post('/', authorize('P023'), SaccoController.createSacco);
router.put('/:id', authorize('P024'), SaccoController.updateSacco);
router.put('/:id/approve', authorize('P026'), SaccoController.approveSacco);
router.put('/:id/reject', authorize('P027'), SaccoController.rejectSacco);
router.delete('/:id', authorize('P025'), SaccoController.deleteSacco);

module.exports = router;
