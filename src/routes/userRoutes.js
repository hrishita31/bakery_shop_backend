import express from 'express';
import {createUser, getUserDetails, userLogin, forgotPassword, userAddress, getUserAddress, getAddressToEdit, editUserAddress, deleteAddress, addProfilePicture, displayProfilePicture, connectWithUs} from '../controller/userController.js';
import {verifyTokenMiddleware, createTokenMiddleware} from '../middleware/middleware.js';
import { sendMail } from '../middleware/sendMail.js';
import { uploadUser } from '../middleware/uploadImage.js';
import { displayProduct } from '../controller/productController.js';

const router = express.Router();

router.post('/newUser', createUser); 
router.post('/getUser', verifyTokenMiddleware, getUserDetails); 
router.post('/userLogin', userLogin); 
router.patch('/resetPassword', forgotPassword);
router.post('/userAddress', verifyTokenMiddleware, userAddress);
router.get('/getUserAddress', verifyTokenMiddleware, getUserAddress);
router.get('/getAddressToEdit', verifyTokenMiddleware, getAddressToEdit);
router.patch('/editUserAddress', verifyTokenMiddleware, editUserAddress);
router.delete('/deleteAddress', verifyTokenMiddleware, deleteAddress);
router.patch('/addProfilePicture', verifyTokenMiddleware, uploadUser.single("image"), addProfilePicture);
router.get('/displayProfilePicture', verifyTokenMiddleware, displayProfilePicture);
router.post('/connectWithUs',verifyTokenMiddleware, connectWithUs);

export default router;

