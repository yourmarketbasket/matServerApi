const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/ticket.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes are protected
router.use(protect);

router.get('/:userId', TicketController.getTickets);
router.get('/scan/:qrCode', authorize('queue_manager', 'driver'), TicketController.scanTicket);

const canUpdateStatus = authorize('queue_manager', 'support_staff', 'driver');
router.put('/:id/status', canUpdateStatus, TicketController.updateTicketStatus);

router.put('/:id/reallocate', authorize('support_staff'), TicketController.reallocateTicket);

module.exports = router;
