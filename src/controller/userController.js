import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

import { OrderHistory } from '../model/userModel.js';
import mongoose from 'mongoose';

import '../model/userModel.js';
import { Product } from '../model/productModel.js'; '../model/productModel.js';
import { addUser, findUserByUsername, validateUser, findDecodedUser, updatePassword, addAddress, findAddress, checkAddressExists, updateAddress, addressToBin, addProfile, checkProfile, newConnection, orderHistory, viewOrderHistory} from '../service/userService.js';
import { createTokenMiddleware } from '../middleware/middleware.js';
import { ADDRESS_DELETED, MISSING_PARAMETER, INVALID_CREDENTIALS, INVALID_PASSWORD, INVALID_EMAIL, USER_NOT_FOUND, PASSWORD_UPDATED, PASSWORDS_NOT_MATCHING, ADDRESS_NOT_ADDED, ADDRESS_NOT_EXIST, ADDRESS_NOT_UPDATED, ADDRESS_NOT_DELETED, NO_PROFILE_PICTURE, NO_REQUEST_RECEIVED } from '../message/messages.js';
import { successResponse, errorResponse } from '../response/response.js';
import { sendMail } from '../middleware/sendMail.js';

const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, confirmPassword} = req.body;
        if (!firstname || !lastname || !email || !username || !password || !confirmPassword) {
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        }

        const isValidEmail = validator.isEmail(email)
                if(!isValidEmail){
                    return errorResponse(res, "", 400, INVALID_EMAIL);
                }
        const isPasswordStrong = validator.isStrongPassword(password, {minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 1})
        if(!isPasswordStrong){
            return errorResponse(res, "", 400, INVALID_PASSWORD);
        }
        if(password !== confirmPassword){
            return errorResponse(res, "", 400, PASSWORDS_NOT_MATCHING);
        }
        
        const hashedPassword = await bcrypt.hash(password, 8);
        const hashedNewPassword = await bcrypt.hash(confirmPassword, 8);

        const user = await addUser(username, { firstname, lastname, email, username, password:hashedPassword, confirmPassword: hashedNewPassword});
        return successResponse(res, user, 203)
    } catch (error) {
        return errorResponse(res, "", 500, error.message)
    }
};

const getUserDetails = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }
        const user = await findUserByUsername(username);
        if (!user) {
            return errorResponse(res, "", 404, USER_NOT_FOUND)
        }
        await sendMail(user);
        console.log("mail sent");
        return successResponse(res, user, 200);
    } catch (error) {
        return errorResponse(res, "", 500, error.message);
    }
};

const userLogin = async(req, res) => {
    const {username, password} = req.body;

    try{
        const user = await validateUser(username, password);
        if(!user) {
            return errorResponse(res, "", 401, INVALID_CREDENTIALS)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorResponse(res, "", 401, INVALID_CREDENTIALS)
        }

        const firstname = user.firstname;
        const lastname = user.lastname;
        const usrname = user.username;
        const email = user.email;
        const isAdmin = user.isAdmin;

        const token = createTokenMiddleware({ userId: user._id, username: user.username });
        const details = {firstname, lastname, usrname, email, isAdmin};
        const response = {token, details}

        return successResponse(res, response, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

const forgotPassword = async(req, res) => {
    try{
        const {newPassword, confirmPassword,token} = req.body;
        const decoded = jwt.decode(token);

        const username = decoded.username;

        const user = await findDecodedUser(username)
        if(!user){
            return errorResponse(res, "", 404, USER_NOT_FOUND);
        }
        if( !newPassword || !confirmPassword) { 
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }
        if(newPassword !== confirmPassword){
            return errorResponse(res, "", 400, PASSWORDS_NOT_MATCHING);
        }
        const newhashedPassword = await bcrypt.hash(newPassword, 8);
        const newconfirmPassword = await bcrypt.hash(confirmPassword, 8);

        // const filter = {username:username};
        // const options = {password:newPassword};
        // const options1 = {confirmPassword:confirmPassword};
        // const update = {...options,...options1};
        // const updatedUser = await User.findOneAndUpdate({username:username}, update, {new:true});


        const updatedUser = await updatePassword({username:username}, {password:newhashedPassword, confirmPassword:newconfirmPassword});
        
        if(!updatedUser){
            return errorResponse(res, "", 404, USER_NOT_FOUND)
        }
        
        return successResponse(res, PASSWORD_UPDATED , 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }

}

const userAddress = async(req, res) => {
        
    try{
        const values = req.body;
    const username = req.query.username;
    const user = await findUserByUsername(username);
    if(!user){

        return errorResponse(res, "", 404, USER_NOT_FOUND)
    }
    const address = await addAddress(username, values)
    if(!address){
        return errorResponse(res, "", 404, ADDRESS_NOT_ADDED);
    }
    return successResponse(res, address, 200);
    }catch (error) {
        return errorResponse(res, "", 500, error.message)
    }
}

const getUserAddress = async(req, res) => {
    try {
        const username = req.query.username; 
        if (!username) {
          return errorResponse(res, "", 400, MISSING_PARAMETER);
        }
    
        const address = await findAddress(username); 
        if (address) {
                return successResponse(res, address, 200);
          
        }else{
          return successResponse(res, null, 200);
        }
      } catch (error) {
        return errorResponse(res, "", 500, error.message)
      }
}

const getAddressToEdit = async(req, res) => {
    try{
        const addressId = req.query._id;
        if(!addressId){
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        }
        const findAddress =await checkAddressExists(addressId);
        if(!findAddress){
            return errorResponse(res, "", 400, ADDRESS_NOT_EXIST);
        }
        return successResponse(res, findAddress, 200);
        
        
    }catch(error){
        return errorResponse(res, "", 500, error.message)
    }
}

const editUserAddress = async(req, res) => {
    try{
    const values = req.body;
    const _id = req.query._id;

    const updatedAddress = await updateAddress(_id, values)

    if(!updatedAddress){
        return errorResponse(res, "", 404, ADDRESS_NOT_UPDATED)
    }
    return successResponse(res, updatedAddress, 200)
    }catch(error){
        return errorResponse(res, "", 500, error.message)
    }
}

const deleteAddress = async(req, res) => {
    try{
    const addressId = req.query._id;

    const deleteAddress = await addressToBin(addressId);

    if(!deleteAddress){
        return errorResponse(res, "", 500, ADDRESS_NOT_DELETED);
    }
    return successResponse(res, ADDRESS_DELETED, 200);
}catch(error){
    return errorResponse(res, "", 500, error.message)
}
}

const addProfilePicture = async(req, res) => {
    try{
        const image = req.file ? {filename:req.file.filename, path:req.file.path, createdAt : Date.now()}:null;
        const username = req.query.username;

    if(!username){
        return errorResponse(res, "", 404, MISSING_PARAMETER);
    }
    const profile = await addProfile({username:username}, {image:image});
    return successResponse(res, profile, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message)
    }
}

const displayProfilePicture = async(req, res) => {
    try{
    const username = req.query.username; 
        if (!username) {
          return errorResponse(res, "", 400, MISSING_PARAMETER);
        }

        const profile = await checkProfile(username);
        if(!profile || !profile.image){
            return errorResponse(res, "", 404, NO_PROFILE_PICTURE)
        }
        return successResponse(res, profile, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message)
    }
}

const connectWithUs = async(req, res) => {
    try{
        const {name, email, message} = req.body;

        if(!name || !email || !message){
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        }

        const saveConnection = await newConnection({name, email, message});
        if(!saveConnection){
            return errorResponse(res, "", 400, NO_REQUEST_RECEIVED);
        }
        return successResponse(res, saveConnection, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message)
    }
}

// const chatWithUs = async (req, res) => {
//   try {
//     const model = new ChatGroq({
//       apiKey: process.env.GROQ_API_KEY,
//       model: "llama-3.3-70b-versatile",
//     });

//     const { message } = req.body;

//     if (!message) {
//       return errorResponse(res, "Message cannot be empty", 400);
//     }

//     const bakeryProducts = await Product.find({
//       category: { $regex: message, $options: "i" }, 
//     });
//     console.log(bakeryProducts, "bakery products");

//     if (bakeryProducts.length > 0) {
//       return res.json({
//         result: `Here are the bakery items related to your search:\n` +
//           bakeryProducts.map((item) => `- ${item.name}: $${item.price}`).join("\n"),
//       });
//     }

//     const bakeryKeywords = ["cake", "cookie", "bread", "pastry", "dessert", "muffin"];
//     const containsBakeryWord = bakeryKeywords.some((word) =>
//       message.toLowerCase().includes(word)
//     );

//     if (!containsBakeryWord) {
//       return res.json({ result: "I can only help with bakery-related queries. Let me know if you're looking for cakes, pastries, or desserts! 🍰" });
//     }

//     const response = await model.call([new HumanMessage(message)]);
//     return successResponse(res, { result: response.content }, 200);
//   } catch (error) {
//     console.error("Chat error:", error);
//     return errorResponse(res, "Failed to get response", 500, error.message);
//   }
// };

const chatWithUs = async (req, res) => {
    try {
        const model = new ChatGroq({
            apiKey: process.env.GROQ_API_KEY,
            model: "llama-3.3-70b-versatile",
        });

        const { message } = req.body;

        if (!message) {
            return errorResponse(res, "Message cannot be empty", 400);
        }

        // Extract keywords from user message
        const messageWords = message.toLowerCase().match(/\b\w+\b/g) || [];
        console.log("Extracted words:", messageWords);

        // Step 1: Search for products in MongoDB
        const bakeryProducts = await Product.find({
            $or: messageWords.map(word => ({
                $or: [
                    { category: { $regex: word, $options: "i" } },
                    { dessertName: { $regex: word, $options: "i" } },
                    { product: { $regex: word, $options: "i" } }
                ]
            }))
        });

        console.log("Found bakery products:", bakeryProducts);

        // Step 2: If products exist, return them
        if (bakeryProducts.length > 0) {
            return res.json({
                result: `Here are the bakery items related to your search:\n` +
                    bakeryProducts.map((item) => `- ${item.dessertName}: ₹${item.price}`).join("\n"),
            });
        }

        // Step 3: Define bakery-related keywords
        const bakeryKeywords = ["cake", "cookie", "bread", "pastry", "dessert", "muffin", "brownie", "cheesecake"];
        const containsBakeryWord = bakeryKeywords.some((word) => message.toLowerCase().includes(word));

        if (!containsBakeryWord) {
            return res.json({
                result: "I can only help with bakery-related queries. Let me know if you're looking for cakes, pastries, or desserts!"
            });
        }

        // Step 4: Call AI Model but keep it domain-specific
        const response = await model.call([
            new HumanMessage(`The user asked: "${message}". Only respond if this is related to bakery items, desserts, or sweets. Do not answer any unrelated questions.`)
        ]);

        return successResponse(res, { result: response.content }, 200);
    } catch (error) {
        console.error("Chat error:", error);
        return errorResponse(res, "Failed to get response", 500, error.message);
    }
};



// const chatWithUs = async (req, res) => {
//     try {
//       const model = new ChatGroq({
//         apiKey: process.env.GROQ_API_KEY,
//         model: "llama-3.3-70b-versatile",
//       });
  
//       const { message } = req.body;
  
//       if (!message) {
//         return errorResponse(res, "Message cannot be empty", 400);
//       }
  
//       const bakeryProducts = await Product.find({
//         $or: [
//           { category: { $regex: message, $options: "i" } },
//           { dessertName: { $regex: message, $options: "i" } },
//           { product: { $regex: message, $options: "i" } }
//         ]
//       });
  
//       console.log(bakeryProducts, "Found bakery products");
  
//       // If matching products are found, return them
//       if (bakeryProducts.length > 0) {
//         return res.json({
//           result: `Here are the bakery items related to your search:\n` +
//             bakeryProducts.map((item) => `- ${item.dessertName}: ₹${item.price}`).join("\n"),
//         });
//       }
  
//       // Check if the message contains bakery-related words
//       const bakeryKeywords = ["cake", "cookie", "bread", "pastry", "dessert", "muffin", "brownie"];
//       const containsBakeryWord = bakeryKeywords.some((word) =>
//         message.toLowerCase().includes(word)
//       );
  
//       if (!containsBakeryWord) {
//         return res.json({ result: "I can only help with bakery-related queries. Let me know if you're looking for cakes, pastries, or desserts! " });
//       }
  
//       // If no product is found but query is bakery-related, use AI model
//       const response = await model.call([new HumanMessage(message)]);
//       return successResponse(res, { result: response.content }, 200);
//     } catch (error) {
//       console.error("Chat error:", error);
//       return errorResponse(res, "Failed to get response", 500, error.message);
//     }
//   };

const saveOrderHistory = async (req, res) => {
    try {
        const { cart } = req.body; 
        console.log(cart, 235);
        
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return errorResponse(res, "", 400, "Invalid order data");
        }

        const username = cart[0].username;
        const cartItems = cart.slice(1); 

        if (!cartItems || cartItems.length === 0) {
            return errorResponse(res, "", 400, "No valid products in the cart");
        }

        const orderId = new mongoose.Types.ObjectId().toString();

        const products = await Promise.all(
            cartItems.map(async (item) => {
                const { productId, quantity, price } = item;
                const totalPrice = quantity * price;

                const productDet = await Product.findById(productId);
                if (!productDet) {
                    throw new Error(`Product not found: ${productId}`);
                }

                return {
                    productId,
                    quantity,
                    price,
                    totalPrice,
                    dessertName: productDet.dessertName,
                };
            })
        );

        const orders = await orderHistory(username, orderId, products);
        if(!orders){
            return errorResponse(res, "", 400, "no order history");
        }

        return successResponse(res, orders, 200);
        
    } catch (error) {
        return errorResponse(res, "", 500, error.message);
    }
};

const showOrderHistory = async(req, res) => {
    try{
        const username  = req.query.username;

        if (!username) {
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }

        const orders = await viewOrderHistory(username);
        if(!orders){
            return errorResponse(res, "", 400, "no orders found");
        }
        return successResponse(res, orders, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }
}

export {createUser, getUserDetails, userLogin, forgotPassword, userAddress, getUserAddress, getAddressToEdit, editUserAddress, deleteAddress, addProfilePicture, displayProfilePicture, connectWithUs, chatWithUs, saveOrderHistory, showOrderHistory};
