import Testimony from '../model/testimonialModel.js';
import { SavedCartProduct } from '../model/productModel.js';

const userPurchase = async(username) => {
    const productPurchase = await SavedCartProduct.find({ username });
    return productPurchase.length;
}

const addTestimony = async(testimonyData) => {
    const testimony = new Testimony(testimonyData);
    return await testimony.save();
}

const showTestimony = async() => {
    const testimonyList =await Testimony.find();
            return testimonyList;
}

export {userPurchase, addTestimony, showTestimony};