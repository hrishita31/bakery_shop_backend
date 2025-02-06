import '../model/productModel.js';
import json from 'express';
import {addProduct, showProduct, changePrice, findProduct, searchDessert, addToCart, findMyCart, addToFavs, findFavs} from '../service/productService.js';
import { PRODUCTS_DISPLAYED, NO_PRODUCTS, MISSING_PARAMETER, PRODUCT_NOT_FOUND, EMPTY_CART, NO_FAVS } from '../message/messages.js';
import { errorResponse, successResponse } from '../response/response.js';

const createProduct = async(req, res) => {
    try{
        // console.log(req.body, 123)
        // console.log(req,89999)
        const {category, product, price, rating} = req.body;

        if(!category || !product || !price){
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        } 

        const image = req.file ? {filename:req.file.filename, path:req.file.path, createdAt : Date.now()}:null;
        //console.log(image);

        const products = await addProduct(`${product} ${category}`,{category, product, image, price, rating});
        // console.log(products,9999)
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
        const {username, productId} = req.body;

        if(!username || !productId){
            return errorResponse(res, "", 404, MISSING_PARAMETER)
        } 

        const addCart = await addToCart(username, productId);
        return successResponse(res, 201, addCart)
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const showCart = async(req, res) => {
    try{
        const {username} = req.query.username;

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
export {createProduct, displayProduct, updatePrice, getProduct, searchProduct, addToMyCart, showCart, addToFav, getFavs};
