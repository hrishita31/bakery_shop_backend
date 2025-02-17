import express from 'express';
import {createUser, getUserDetails, userLogin, forgotPassword, userAddress, getUserAddress, getAddressToEdit, editUserAddress, deleteAddress, addProfilePicture, displayProfilePicture} from '../controller/userController.js';
import {verifyTokenMiddleware, createTokenMiddleware} from '../middleware/middleware.js';
import { sendMail } from '../middleware/sendMail.js';
import { uploadUser } from '../middleware/uploadImage.js';
import { displayProduct } from '../controller/productController.js';

const router = express.Router();

router.post('/newUser', createUser); 
router.post('/getUser', getUserDetails); 
router.post('/userLogin', userLogin); 
router.patch('/resetPassword', forgotPassword);
router.post('/userAddress', verifyTokenMiddleware, userAddress);
router.get('/getUserAddress', verifyTokenMiddleware, getUserAddress);
router.get('/getAddressToEdit', verifyTokenMiddleware, getAddressToEdit);
router.patch('/editUserAddress', verifyTokenMiddleware, editUserAddress);
router.delete('/deleteAddress', verifyTokenMiddleware, deleteAddress);
router.patch('/addProfilePicture', uploadUser.single("image"), addProfilePicture);
router.get('/displayProfilePicture', displayProfilePicture);

export default router;

