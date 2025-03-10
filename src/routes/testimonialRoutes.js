import express from 'express';
import { newTestimony , displayTestimony} from '../controller/testimonialController.js';
import { uploadTestimony } from '../middleware/uploadImage.js';
import { verifyTokenMiddleware } from '../middleware/middleware.js';

const router = express.Router();

router.post('/postTestimony', verifyTokenMiddleware, uploadTestimony.single("image"),  newTestimony);
router.get('/displayTestimony', verifyTokenMiddleware, displayTestimony);

export default router;