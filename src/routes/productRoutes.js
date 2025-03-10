import express from 'express';
import multer from 'multer';
// import {upload} from '../index.js';
import {createProduct , displayProduct, getProduct, searchProduct, getCategory, sortProductsAscending, sortProductsDescending, sortPriceAscending, sortPriceDescending, addToMyCart, showCart, incrementProductCart, decrementProductCart, deleteFromCart, addToFav, getFavs, checkout, deleteFromFavs, saveOnLogout} from '../controller/productController.js';
import {verifyTokenMiddleware} from '../middleware/middleware.js';
// import {uploadImageHelper} from '../middleware/uploadImage.js';
import {uploadProduct} from '../middleware/uploadImage.js';

const router = express.Router();

router.post('/newProduct', verifyTokenMiddleware, uploadProduct.single("image"),  createProduct); //admin only
router.get('/displayProduct', displayProduct);
router.post('/getProductFromCategory', getProduct);
router.post('/searchProduct', searchProduct);
router.get('/getCategory', getCategory);
router.post('/sortProductsAscending', sortProductsAscending);
router.post('/sortProductsDescending', sortProductsDescending);
router.post('/sortPriceAscending', sortPriceAscending);
router.post('/sortPriceDescending', sortPriceDescending);
router.post('/addToCart', verifyTokenMiddleware, addToMyCart); //verified user only
router.get('/showCart', verifyTokenMiddleware, showCart); //verified user only
router.patch('/incrementProductQuantity',verifyTokenMiddleware,  incrementProductCart) //verified user only
router.patch('/decrementProductQuantity',verifyTokenMiddleware,  decrementProductCart) //verified user only
router.delete('/deleteFromCart',verifyTokenMiddleware,  deleteFromCart); //verified user only
router.post('/addToFavs',verifyTokenMiddleware, addToFav); //verified user only
router.get('/getFavs',verifyTokenMiddleware,  getFavs); //verified user only
router.post('/checkout',verifyTokenMiddleware, checkout);
router.delete('/deleteFromFavs',verifyTokenMiddleware, deleteFromFavs);
router.post('/saveOnLogout', verifyTokenMiddleware, saveOnLogout)

export default router;