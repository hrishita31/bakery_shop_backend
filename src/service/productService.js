import {Product} from '../model/productModel.js';
import {FavProduct} from '../model/productModel.js';
import { CartProduct } from '../model/productModel.js';
import { SavedCartProduct } from '../model/productModel.js';
import {PRODUCT_PRESENT, PRODUCT_NOT_FOUND, ALREADY_IN_CART, ALREADY_IN_FAVS, CART_EMPTY, NOT_IN_CART, NO_DECREMENT, NO_FAVS, NO_PRODUCTS} from '../message/messages.js';

const addProduct = async(dessertName, productData) => {
    const sameDessert = await Product.exists({dessertName});
    if(sameDessert){
        throw new Error(PRODUCT_PRESENT);
    }
    const product = new Product(productData);
    return await product.save();
};

const showProduct = async() => {
    const productList =await Product.find();
    return productList;
}

const findProduct = async(category) => {
    return await Product.find({category});
};

const searchDessert = async(product) => {
    return await Product.find({product: {'$regex' : product, '$options':'i'}});
    
};

const showCategories = async() => {
    const productList = await Product.find();
    const categories = productList.map(product => product.category);

    const uniqueCategories = new Set(categories);
    const categoriesFinal = [...uniqueCategories];

    return categoriesFinal;
}

const ascendingOrder = async() => {
    const query = {};
    const sort = {product : 1, category:1};
    const cursor = Product.find(query).sort(sort);
    let sortedProducts = []
    for await (const doc of cursor) {
        sortedProducts.push(doc);
      }
      return sortedProducts;
}

const descendingOrder = async() => {
    const query = {};
    const sort = {product:-1, category : -1};
    const cursor = Product.find(query).sort(sort);
    let sortedProducts = []
    for await (const doc of cursor) {
        sortedProducts.push(doc);
      }
      return sortedProducts;
}

const ascendingPrice = async() => {
    const query = {};
    const sort = {price : 1};
    const cursor = Product.find(query).sort(sort);
    let sortedProducts = []
    for await (const doc of cursor) {
        sortedProducts.push(doc);
      }
      return sortedProducts;
}

const descendingPrice = async() => {
    const query = {};
    const sort = {price : -1};
    const cursor = Product.find(query).sort(sort);
    let sortedProducts = []
    for await (const doc of cursor) {
        sortedProducts.push(doc);
      }
      return sortedProducts;
}

const addToCart = async(username, productId, quantity) => {
    const product = await Product.findOne({_id:productId});
    if(!product){
        throw new Error(PRODUCT_NOT_FOUND);
    }
    const existingCart = await CartProduct.findOne({username, productId});
    if(existingCart){
        throw new Error(ALREADY_IN_CART)
    }
    const productPrice = product.price;
    const price = productPrice*quantity;
    const totalPrice = price;
    const newCart = new CartProduct({username, productId:product._id, quantity, price, totalPrice});
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

const increaseQuantity = async(cartProductId) => {
    const product = await CartProduct.exists({_id:cartProductId});
    if(!product){
        throw new Error(NOT_IN_CART);
    }
    const cartProductWithDetails = await CartProduct.findOne(product);
    const oneProductPrice = cartProductWithDetails.price;
    const quantity = cartProductWithDetails.quantity;
    const newQuantity = quantity+1;
    const newPrice = newQuantity*oneProductPrice;
    return await CartProduct.findOneAndUpdate({_id: cartProductId}, {quantity: newQuantity, totalPrice:newPrice}, {new:true});
}

const decreaseQuantity = async(cartProductId) => {
    const product = await CartProduct.exists({productId:cartProductId});
    if(!product){
        throw new Error(NOT_IN_CART);
    }
    const cartProductWithDetails = await CartProduct.findOne(product);
    const oneProductPrice = cartProductWithDetails.price;
    const quantity = cartProductWithDetails.quantity;
    if(quantity===1){
        const [cartDeleteResult, savedCartDeleteResult] = await Promise.all([
            CartProduct.deleteOne({_id:product}),
            SavedCartProduct.deleteOne({productId:cartProductId}),
        ])
        // return await CartProduct.deleteOne({_id: product});
        return{
            cartDeleted: cartDeleteResult,
            savedCartDeleted : savedCartDeleteResult
        }
    }
    const newQuantity = quantity-1;
    const newPrice = newQuantity*oneProductPrice;
    return await CartProduct.findOneAndUpdate({_id: cartProductId}, {quantity: newQuantity, totalPrice:newPrice}, {new:true});
}

const removeFromCart = async(username, productId) => {

    const existingCart = await CartProduct.findOne({username, productId});
    const idToDelete = existingCart._id;
    
    const existingSavedCart = await SavedCartProduct.findOne({username, productId});
    if(existingSavedCart){
        const idToDeleteFromCheckoutCart = existingSavedCart._id;
    
    const [cartDeleteResult, savedCartDeleteResult] = await Promise.all([
        CartProduct.deleteOne({_id:idToDelete}),
        SavedCartProduct.deleteOne({_id:idToDeleteFromCheckoutCart}),
    ])
    return{
        cartDeleted: cartDeleteResult,
        savedCartDeleted : savedCartDeleteResult
    }
    }
    
    return CartProduct.deleteOne({_id:idToDelete});

    
}

const cartSaveOnCheckout = async(username, productId, quantity, price, totalPrice) => {
    const productDet = await Product.exists({_id:productId});
    const productDetails = await Product.findOne(productDet)

    const dessertName = productDetails.dessertName;
    const category = productDetails.category;
    const product = productDetails.product;
    const image = productDetails.image.filename;

    const [deletePreviousProducts, userCart, updatedCart] = await Promise.all( [ SavedCartProduct.deleteOne({productId:productId}), new SavedCartProduct({username, productId, quantity, price, totalPrice, dessertName, category, product, image}), CartProduct.findOneAndUpdate({productId:productId}, {quantity:quantity, totalPrice:quantity*price}, {new:true})])
    return { deletedProducts : deletePreviousProducts,
         userCart : userCart.save(),
         cartOnCheckout : updatedCart,
        };
}


const addToFavs = async(username, productId) => {
    const product = await Product.findOne({_id: productId });
    if(!product){
        throw new Error(PRODUCT_NOT_FOUND);
    }
    console.log(product, 846);

    const existingFav = await FavProduct.findOne({username, productId});
    if(existingFav){
        throw new Error(ALREADY_IN_FAVS);
    }
    console.log(existingFav, 134)

    const newFav = new FavProduct({username, productId:product._id, dessertName:product.dessertName, price:product.price, image:product.image.filename});
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

const removeFromFavs = async(username, productId) => {
    const existingFav = await FavProduct.findOne({username, productId});
    const idToDelete = existingFav._id;

    return await FavProduct.deleteOne({_id:idToDelete});
}

const cartSaveOnLogout = async(username, productId, quantity, price, totalPrice) => {
    
    return await CartProduct.findOneAndUpdate({productId:productId}, {quantity:quantity, totalPrice:quantity*price}, {new:true})

}

const deleteAllProducts = async(username) => {
    const [deleteAllCartItemsOfUsername, deleteAllSavedCartItemsOfUsername] = await Promise.all( [ CartProduct.deleteMany({username: username}),  SavedCartProduct.deleteMany({username: username})])
    return { deleteCart : deleteAllCartItemsOfUsername,
        deleteSavedCart : deleteAllSavedCartItemsOfUsername,
        };
}

export {addProduct, showProduct, findProduct, searchDessert, showCategories, ascendingOrder, descendingOrder, ascendingPrice, descendingPrice, addToCart, findMyCart, increaseQuantity, decreaseQuantity, cartSaveOnCheckout, removeFromCart, addToFavs, findFavs, removeFromFavs, cartSaveOnLogout, deleteAllProducts};