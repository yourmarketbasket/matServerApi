const express = require('express');
const router = express.Router();
const SupportController = require('../controllers/support.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes are protected
router.use(protect);

const isSupportAdmin = authorize('support_staff', 'admin', 'superuser');
const canCreateTicket = authorize('passenger', 'driver', 'support_staff', 'admin', 'superuser');

// Routes for support tickets
router.post('/', canCreateTicket, SupportController.createTicket);
router.get('/', SupportController.getTickets);
router.get('/:id', SupportController.getTicketById);
router.put('/:id', isSupportAdmin, SupportController.updateTicket);
router.delete('/:id', authorize('superuser'), SupportController.deleteTicket); // Only superuser can delete tickets
router.post('/:id/escalate', isSupportAdmin, SupportController.escalateTicket);

module.exports = router;
