const express = require('express');
const router = express.Router();
const BusOperatorController = require('../controllers/busOperator.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes are protected
router.use(protect);

// Only admins and superusers can manage bus operators
const isAdmin = authorize('admin', 'superuser');

router.post('/', isAdmin, BusOperatorController.registerOperator);
router.get('/', isAdmin, BusOperatorController.getOperators);
router.get('/:id', isAdmin, BusOperatorController.getOperatorById);
router.put('/:id/status', isAdmin, BusOperatorController.updateOperatorStatus);
router.put('/:id', isAdmin, BusOperatorController.updateOperator);
router.delete('/:id', isAdmin, BusOperatorController.deleteOperator);

module.exports = router;
