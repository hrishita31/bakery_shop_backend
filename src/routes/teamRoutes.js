import express from 'express';
import {createMember } from '../controller/teamController.js';

const router = express.Router();

router.post('/postTeamMember', createMember);

export default router;
