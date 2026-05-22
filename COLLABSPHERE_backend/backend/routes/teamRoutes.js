const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const teamController = require('../controllers/teamController');

// Get all teams
router.get('/', teamController.getAllTeams);

// Create a new team
router.post('/create', auth, teamController.createTeam);

// Get team by ID
router.get('/:id', teamController.getTeamById);

// Delete team (only creator)
router.delete('/:id', auth, teamController.deleteTeam);

// Join team
router.post('/join/:id', auth, teamController.joinTeam);

// Get pending join requests for a team (only creator)
router.get('/:id/requests', auth, teamController.getTeamJoinRequests);

// Accept join request (only creator)
router.post('/requests/:id/accept', auth, teamController.acceptTeamRequest);

// Reject join request (only creator)
router.post('/requests/:id/reject', auth, teamController.rejectTeamRequest);

module.exports = router;
