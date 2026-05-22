const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController');

router.post('/create', auth, projectController.createProject);
router.get('/all', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.delete('/delete/:id', auth, projectController.deleteProject);

router.post('/join/:id', auth, projectController.requestToJoin);
router.get('/:id/requests', auth, projectController.getProjectRequests);
router.post('/requests/:requestId/accept', auth, projectController.acceptRequest);
router.post('/requests/:requestId/reject', auth, projectController.rejectRequest);

router.get('/match/me', auth, projectController.matchProjectsForUser);

module.exports = router;
