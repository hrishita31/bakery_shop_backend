import express from 'express';
import {newClassStudent } from '../controller/classController.js';
import { verifyTokenMiddleware } from '../middleware/middleware.js';

const router = express.Router();

router.post('/classRegistration', verifyTokenMiddleware, newClassStudent); 

export default router;

