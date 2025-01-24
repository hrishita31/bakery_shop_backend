import express from 'express';
import {classOptions, newClassStudent } from '../controller/classController.js';

const router = express.Router();

router.post('/classRegistration', classOptions, newClassStudent);

export default router;
