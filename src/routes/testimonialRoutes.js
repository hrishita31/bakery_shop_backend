import express from 'express';
import { newTestimony } from '../controller/testimonialController.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/postTestimony',  upload.single('image'), newTestimony);

export default router;

