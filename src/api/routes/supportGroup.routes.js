const express = require('express');
const router = express.Router();
const SupportGroupController = require('../controllers/supportGroup.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes in this file are protected and for authorized users only
router.use(protect);

// Define Support Group Management Routes
router.post('/', authorize('P129'), SupportGroupController.createSupportGroup);
router.get('/', authorize('P130'), SupportGroupController.getSupportGroups);
router.get('/:id', authorize('P131'), SupportGroupController.getSupportGroupById);
router.put('/:id', authorize('P132'), SupportGroupController.updateSupportGroup);
router.delete('/:id', authorize('P133'), SupportGroupController.deleteSupportGroup);
router.post('/:id/members/:userId', authorize('P134'), SupportGroupController.addMemberToSupportGroup);
router.delete('/:id/members/:userId', authorize('P135'), SupportGroupController.removeMemberFromSupportGroup);

module.exports = router;
