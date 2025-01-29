import express from 'express';
import {newClassStudent } from '../controller/classController.js';

const router = express.Router();

router.post('/classRegistration', newClassStudent);

export default router;

