import express from 'express';
import multer from 'multer';
// import {upload} from '../index.js';
import {createProduct , updatePrice, getProduct, searchProduct, addToMyCart, showCart, addToFav, getFavs} from '../controller/productController.js';
import {verifyTokenMiddleware} from '../middleware/middleware.js';
import upload from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/newProduct', upload.single('image'), createProduct);
router.patch('/updatePrice/:dessertName', verifyTokenMiddleware, updatePrice);
router.get('/getProduct/:category', getProduct);
router.get('/searchProduct/:product', searchProduct);
router.post('/addToCart', addToMyCart);
router.get('/showCart', showCart);
router.post('/addToFavs', addToFav);
router.get('/getFavs', getFavs);

export default router;