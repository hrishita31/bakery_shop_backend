import express from 'express';
import {createMember, displayMember } from '../controller/teamController.js';
import {uploadMember} from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/postTeamMember', uploadMember.single("image"), createMember);
router.get('/displayMember', displayMember);

export default router;
