import '../model/productModel.js';
import json from 'express';
import {addProduct, changePrice, findProduct, searchDessert, addToCart, findMyCart, addToFavs, findFavs} from '../service/productService.js';
import { CART_NOT_UPDATED, MISSING_PARAMETER, PRODUCT_NOT_FOUND, EMPTY_CART, NO_FAVS } from '../message/messages.js';

const createProduct = async(req, res) => {
    try{
        const {category, product, dessertName, price, rating} = req.query;

        if(!category || !product || !price){
            return res.status(400).json({success:false, message:MISSING_PARAMETER,
            });
        } 

        const image = req.file ? {filename:req.file.filename, path:req.file.path, createdAt : Date.now()}:null;
        //console.log(image);

        const products = await addProduct({category, product, dessertName, image, price, rating});
        
        res.status(200).json({success:true, message:products});

    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
}

const updatePrice = async(req, res) => {
    try{
        const {dessertName} = req.params;
        const {newPrice} = req.body;

        if(!dessertName){
            return res.status(400).json({success:false, message:MISSING_PARAMETER});
        }

        const updatedProduct = await changePrice(dessertName, newPrice);

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: PRODUCT_NOT_FOUND });
        }

        res.status(200).json({
            success: true,
            message: updatedProduct,
        });

    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}

const getProduct = async(req, res) => {
    try{
        // const {category} = findProduct(req.query);
        const category = await findProduct(req.params.category);
        if(!category){
            res.status(404).json({success:false, message:PRODUCT_NOT_FOUND});
        }
        res.status(200).json({success:true, message:category});
    }catch(error){
        res.status(500).json({success: false, message: error.message});
    }
}

const searchProduct = async(req, res) => {
    try{
        const desserts = await searchDessert(req.params.product);

        if(!desserts){
            res.status(404).json({success:false, message:MISSING_PARAMETER})
        }
        res.status(201).json({success:true, message:desserts});
    }catch(error){
        res.status(500).json({success: false, message:error.message});
    }
}

const addToMyCart = async(req, res) => {
    try{
        const {username, productId} = req.query;

        if(!username || !productId){
            return res.status(400).json({success:false, message:MISSING_PARAMETER,});
        } 

        const addCart = await addToCart(username, productId);
        res.status(201).json({success:true, message:addCart});
    }catch(error){
        res.status(500).json({success:false, message:error.message})
    }
}

const showCart = async(req, res) => {
    try{
        const {username} = req.query;

        if(!username){
            return res.status(400).json({success:false, message:MISSING_PARAMETER});
        }

        const findCart = await findMyCart(username);
        if(!findCart){
            return res.status(400).json({success, message:EMPTY_CART});
        }
        res.status(201).json({success:true, message:findCart});
    }catch(error){

    }
}

const addToFav = async(req, res) => {
    try{
        const {username, productId} = req.query;

        if(!username || !productId){
            return res.status(400).json({success:false, message:MISSING_PARAMETER});
        } 
         
        const addFav = await addToFavs(username, productId);
        res.status(201).json({success:true, message:addFav});

    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}

const getFavs = async(req, res) => {
    try{
        const {username} = req.query;

        if(!username){
            return res.status(400).json({success:false, message:MISSING_PARAMETER});
        }

        const findFav = await findFavs(username);
        if(!findFav){
            return res.status(400).json({success, message:NO_FAVS});
        }
        res.status(201).json({success:true, message:findFav});

    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}
export {createProduct, updatePrice, getProduct, searchProduct, addToMyCart, showCart, addToFav, getFavs};
