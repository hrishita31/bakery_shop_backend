import express from 'express';
import { newTestimony , displayTestimony} from '../controller/testimonialController.js';
import { uploadTestimony } from '../middleware/uploadImage.js';
// import  from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/postTestimony', uploadTestimony.single("image"),  newTestimony);
router.get('/displayTestimony', displayTestimony);

export default router;

