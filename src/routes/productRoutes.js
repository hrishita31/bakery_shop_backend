import express from 'express';
import multer from 'multer';
// import {upload} from '../index.js';
import {createProduct , displayProduct, updatePrice, getProduct, searchProduct, addToMyCart, showCart, addToFav, getFavs} from '../controller/productController.js';
import {verifyTokenMiddleware} from '../middleware/middleware.js';
// import {uploadImageHelper} from '../middleware/uploadImage.js';
import {uploadProduct} from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/newProduct', uploadProduct.single("image"),  createProduct);
router.get('/displayProduct', displayProduct);
router.patch('/updatePrice', verifyTokenMiddleware, updatePrice);
router.get('/getProduct', getProduct);
router.get('/searchProduct', searchProduct);
router.post('/addToCart', addToMyCart);
router.get('/showCart', showCart);
router.post('/addToFavs', addToFav);
router.get('/getFavs', getFavs);

export default router;