import express from 'express';
import multer from 'multer';
// import {upload} from '../index.js';
import {createProduct , displayProduct, updatePrice, getProduct, searchProduct, addToMyCart, showCart, addToFav, getFavs} from '../controller/productController.js';
import {verifyTokenMiddleware} from '../middleware/middleware.js';
// import {uploadImageHelper} from '../middleware/uploadImage.js';
import {uploadProduct} from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/newProduct', uploadProduct.single("image"),  createProduct); //admin only
router.get('/displayProduct', displayProduct);
router.patch('/updatePrice', verifyTokenMiddleware, updatePrice); //admin only
router.get('/getProduct', getProduct);
router.get('/searchProduct', searchProduct);
router.post('/addToCart', addToMyCart); //verified user only
router.get('/showCart', showCart); //verified user only
router.post('/addToFavs', addToFav); //verified user only
router.get('/getFavs', getFavs); //verified user only

export default router;