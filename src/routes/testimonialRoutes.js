import express from 'express';
import { newTestimony } from '../controller/testimonialController.js';
// import  from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/postTestimony',   newTestimony);

export default router;

