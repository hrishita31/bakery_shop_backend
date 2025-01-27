import express from 'express';
import {createUser, getUserDetails, userLogin, forgotPassword} from '../controller/userController.js';
import {verifyTokenMiddleware, createTokenMiddleware} from '../middleware/middleware.js';

const router = express.Router();

router.post('/newUser', createUser); 
router.get('/getUser', verifyTokenMiddleware, getUserDetails);
router.post('/userLogin', userLogin); 
router.patch('/forgotPwd', forgotPassword)

export default router;

