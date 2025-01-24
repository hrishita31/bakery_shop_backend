import express from 'express';
import {jobOptions, createMember } from '../controller/teamController.js';

const router = express.Router();

router.post('/postTeamMember', jobOptions, createMember);

export default router;
