const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/team.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

// All routes in this file are protected and for authorized users only
router.use(protect);

// Define Team Management Routes
router.post('/', authorize('P122'), TeamController.createTeam);
router.get('/', authorize('P123'), TeamController.getTeams);
router.get('/:id', authorize('P124'), TeamController.getTeamById);
router.put('/:id', authorize('P125'), TeamController.updateTeam);
router.delete('/:id', authorize('P126'), TeamController.deleteTeam);
router.post('/:id/members/:userId', authorize('P127'), TeamController.addMemberToTeam);
router.delete('/:id/members/:userId', authorize('P128'), TeamController.removeMemberFromTeam);

module.exports = router;
