import express from 'express';
import {createMember, addToTeam, displayMembers, displayTeamMembers, deleteMember } from '../controller/teamController.js';
import {uploadMember} from '../middleware/uploadImage.js';
import { verifyTokenMiddleware } from '../middleware/middleware.js';

const router = express.Router();

router.post('/registerToTeam', uploadMember.single("image"), createMember);
router.get('/displayMember', verifyTokenMiddleware, displayMembers);//admin only
router.post('/addToTeam', verifyTokenMiddleware, addToTeam); // admin only
router.get('/displayTeamMembers', displayTeamMembers)
router.post('/deleteMember', verifyTokenMiddleware, deleteMember); //admin only

export default router;
