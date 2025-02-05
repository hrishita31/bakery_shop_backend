import {Product} from '../model/productModel.js';
import {FavProduct} from '../model/productModel.js';
import { CartProduct } from '../model/productModel.js';
import {PRODUCT_PRESENT, PRODUCT_NOT_FOUND, ALREADY_IN_CART, ALREADY_IN_FAVS, CART_EMPTY, NO_FAVS, NO_PRODUCTS} from '../message/messages.js';

const addProduct = async(dessertName, productData) => {
// console.log(productData, 111, dessertName)
    const sameDessert = await Product.exists({dessertName});
    if(sameDessert){
        throw new Error(PRODUCT_PRESENT);
    }
    const product = new Product(productData);

    // console.log(product, 567)

    return await product.save();
};

const showProduct = async() => {
    const productList =await Product.find();
    console.log(productList, 123)
    return productList;
}

const changePrice = async(dessertName, updatePrice) => {

    return await Product.findOneAndUpdate({dessertName}, {price:updatePrice}, {new:true});
};

const findProduct = async(category) => {
    return await Product.find({category});
};

const searchDessert = async(product) => {
    return await Product.find({product});
};

const addToCart = async(username, productId) => {
    const product = await Product.findOne({_id:productId});
    if(!product){
        throw new Error(PRODUCT_NOT_FOUND);
    }
    const existingCart = await CartProduct.findOne({username, productId});

    if(existingCart){
        throw new Error(ALREADY_IN_CART);
    }
    const newCart = new CartProduct({username, productId:product._id});
    await newCart.save();
    return product;
};

const findMyCart = async(username) => {
    const cartWithDetails = await CartProduct.aggregate([
        { $match: { username } },
        {
            $lookup: {
                from: 'products', 
                localField: 'productId',
                foreignField: '_id',
                as: 'productDetails',
            },
        }
    ]);

    if(cartWithDetails===0){
        throw new Error(CART_EMPTY);
    }
    return cartWithDetails;
};

const addToFavs = async(username, productId) => {
    
    const product = await Product.findOne({_id: productId });
    
    if(!product){
        throw new Error(PRODUCT_NOT_FOUND);
    }

    const existingFav = await FavProduct.findOne({username, productId});

    if(existingFav){
        throw new Error(ALREADY_IN_FAVS);
    }

    const newFav = new FavProduct({username, productId:product._id});
    await newFav.save();
    return product;
};

const findFavs = async(username) => {
    const favWithDetails = await FavProduct.aggregate([
        { $match: { username } },
        {
            $lookup: {
                from: 'products', 
                localField: 'productId',
                foreignField: '_id',
                as: 'productDetails',
            },
        }, 
    ]);

    if(favWithDetails===0){
        throw new Error(NO_FAVS);
    }
    return favWithDetails;
};

export {addProduct, showProduct, changePrice, findProduct, searchDessert, addToCart, findMyCart, addToFavs, findFavs};