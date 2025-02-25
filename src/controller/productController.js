import '../model/productModel.js';
import json from 'express';
import {addProduct, showProduct, changePrice, findProduct, searchDessert, addToCart, findMyCart, increaseQuantity, decreaseQuantity, removeFromCart, cartSaveOnCheckout, addToFavs, findFavs} from '../service/productService.js';
import { NO_PRODUCTS, MISSING_PARAMETER, PRODUCT_NOT_FOUND, NOT_REMOVED_FROM_CART, NO_INCREMENT, NO_DECREMENT, EMPTY_CART, NO_FAVS } from '../message/messages.js';
import { errorResponse, successResponse } from '../response/response.js';

const createProduct = async(req, res) => {
    try{
        const {category, product, price, rating} = req.body;

        if(!category || !product || !price){
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        } 

        const image = req.file ? {filename:req.file.filename, path:req.file.path, createdAt : Date.now()}:null;
        const products = await addProduct(`${product} ${category}`,{category, product, image, price, rating});
       return successResponse(res, products, 200);

    }catch(error){
        return errorResponse(res, "", 500, error.message)
    }
}

const displayProduct = async(req, res) => {
    try{
        const allProducts = await showProduct();

        if(!allProducts){
            return errorResponse(res, "", 400, NO_PRODUCTS);
        }
        return successResponse(res, allProducts, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
   
}

const updatePrice = async(req, res) => {
    try{
        const {dessertName, newPrice} = req.body;

        if(!dessertName){
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }

        const updatedProduct = await changePrice(dessertName, newPrice);

        if (!updatedProduct) {
            return errorResponse(res, "", 404, PRODUCT_NOT_FOUND)
        }
        return successResponse(res, updatedProduct, 200);

    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const getProduct = async(req, res) => {
    try{
        // const {category} = findProduct(req.query);
        const category = await findProduct(req.query.category);
        if(!category){
            return errorResponse(res, "", 404, PRODUCT_NOT_FOUND)
        }
        return successResponse(res, category, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message)
    }
}

const searchProduct = async(req, res) => {
    try{
        const product = await searchDessert(req.query.product);

        if(!product){
            return errorResponse(res, "", 404, MISSING_PARAMETER)
        }
        return successResponse(res, product, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const addToMyCart = async(req, res) => {
    try{
        const productId = req.query._id;
        const {username} = req.body;
        const quantity = 1;
        if(!username || !productId ||!quantity){
            return errorResponse(res, "", 404, MISSING_PARAMETER)
        } 
        
        const addCart = await addToCart(username, productId,quantity);
        return successResponse(res, addCart, 200)
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const showCart = async(req, res) => {
    try{
        const username = req.query.username; 

        if(!username){
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }

        const findCart = await findMyCart(username);
        if(!findCart){
            return errorResponse(res, "", 400, EMPTY_CART)
        }
        return successResponse(res, findCart, 201);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const incrementProductCart = async(req, res) => {
    try{
    const cartProductId = req.query.productId;

    if(!cartProductId){
        return errorResponse(res, "", 400, MISSING_PARAMETER)
    }

    const incrementQuantity = await increaseQuantity(cartProductId);
    if(!incrementQuantity){
        return errorResponse(res, "", 400, NO_INCREMENT)
    }
    return successResponse(res, incrementQuantity, 201);
}catch(error){
    return errorResponse(res, "", 500, error.message);
}
}

const decrementProductCart = async(req, res) => {
    try{
        const cartProductId = req.query.productId;
        if(!cartProductId){
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }
    
        const decrementQuantity = await decreaseQuantity(cartProductId);
        if(!decrementQuantity){
            return errorResponse(res, "", 400, NO_DECREMENT)
        }
        return successResponse(res, decrementQuantity, 201);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const deleteFromCart = async(req, res) => {
    try{
        const productId = req.query._id;

        const removedProduct = await removeFromCart(productId);

        if(!removedProduct){
            return errorResponse(res, "", 404, NOT_REMOVED_FROM_CART)
        }
        return successResponse(res, removedProduct, 200)
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const checkout = async(req, res) => {
    try{
        const {cart} = req.body;

        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return errorResponse(res, "", 400, "Invalid cart data");
        }

        const username = cart[0].username;

        const cartItem = cart.slice(1,)

        const savedCartPromises = cartItem.map(async (item) => {
            const {  productId, quantity, price } = item;
            const totalPrice = quantity * price;
            return await cartSaveOnCheckout(username, productId, quantity, price, totalPrice);
        });

        const savedCarts = await Promise.all(savedCartPromises);
        if (!savedCarts || savedCarts.length === 0) {
            return errorResponse(res, "", 404, "Could not save any cart items");
        }


        return successResponse(res, savedCarts, 200);    
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const addToFav = async(req, res) => {
    try{
        const {username, productId} = req.body;

        if(!username || !productId){
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        } 
         
        const addFav = await addToFavs(username, productId);
        return successResponse(res, addFav, 201);

    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const getFavs = async(req, res) => {
    try{
        const {username} = req.query.username;

        if(!username){
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        }

        const findFav = await findFavs(username);
        if(!findFav){
            return errorResponse(res, "", 400, NO_FAVS);
        }
        return successResponse(res, findFav, 201);

    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}
export {createProduct, displayProduct, updatePrice, getProduct, searchProduct, addToMyCart, showCart, incrementProductCart, decrementProductCart, deleteFromCart, checkout, addToFav, getFavs};
