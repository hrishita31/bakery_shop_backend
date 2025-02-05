import express from 'express';
import {createUser, getUserDetails, userLogin, forgotPassword} from '../controller/userController.js';
import {verifyTokenMiddleware, createTokenMiddleware} from '../middleware/middleware.js';
import { sendMail } from '../middleware/sendMail.js';

const router = express.Router();

router.post('/newUser', createUser); 
router.post('/getUser', getUserDetails);
router.post('/userLogin', userLogin); 
router.patch('/resetPassword', forgotPassword);
// router.post('/submitPasswords', submitPasswords)

export default router;

