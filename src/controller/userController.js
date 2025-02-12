import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import '../model/userModel.js';
import { addUser, findUserByUsername, validateUser, findDecodedUser, updatePassword, addAddress, findAddress, checkAddressExists, updateAddress, addressToBin} from '../service/userService.js';
import { createTokenMiddleware } from '../middleware/middleware.js';
import { MISSING_PARAMETER, INVALID_CREDENTIALS, INVALID_PASSWORD, INVALID_EMAIL, USER_NOT_FOUND, PASSWORD_UPDATED, PASSWORDS_NOT_MATCHING, ADDRESS_NOT_ADDED, ADDRESS_NOT_EXIST, ADDRESS_NOT_UPDATED, ADDRESS_NOT_DELETED } from '../message/messages.js';
import { successResponse, errorResponse } from '../response/response.js';
import { sendMail } from '../middleware/sendMail.js';

const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, confirmPassword} = req.body;
        // Ensure all required parameters are present
        if (!firstname || !lastname || !email || !username || !password || !confirmPassword) {
            return errorResponse(res, "", 400, MISSING_PARAMETER);
        }

        if(!email.includes("@gmail.com")){
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
        const { username} = req.body;
        if (!username) {
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }
        const user = await findUserByUsername(username);
        console.log(user, 78)
        if (!user) {
            return errorResponse(res, "", 404, USER_NOT_FOUND)
        }
        const email = user.email;
        console.log(`mail to be sent to ${email}`)
        await sendMail(user);
        console.log("mail sent", 999)
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


        const token = createTokenMiddleware({ userId: user._id, username: user.username });
        const details = {firstname, lastname, usrname, email};
        console.log(user, 123);
        // console.log(...user, 456);
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
        console.log("decoded username: ", username);

        const user = await findDecodedUser(username)
        if(!user){
            return errorResponse(res, "", 404, USER_NOT_FOUND);
        }
        console.log("user: ", user);
        if( !newPassword || !confirmPassword) { 
            return errorResponse(res, "", 400, MISSING_PARAMETER)
        }
        console.log("passwords entered")
        if(newPassword !== confirmPassword){
            return errorResponse(res, "", 400, PASSWORDS_NOT_MATCHING);
        }
        console.log("passwords matching")
        const newhashedPassword = await bcrypt.hash(newPassword, 8);
        const newconfirmPassword = await bcrypt.hash(confirmPassword, 8);

        // const filter = {username:username};
        // const options = {password:newPassword};
        // const options1 = {confirmPassword:confirmPassword};
        // const update = {...options,...options1};
        // const updatedUser = await User.findOneAndUpdate({username:username}, update, {new:true});


        const updatedUser = await updatePassword({username:username}, {password:newhashedPassword, confirmPassword:newconfirmPassword});
        
        console.log("updated user: ", updatedUser)
        if(!updatedUser){
            return errorResponse(res, "", 404, USER_NOT_FOUND)
        }
        console.log("passwords updated");
        
        return successResponse(res, PASSWORD_UPDATED , 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message);
    }

}

const userAddress = async(req, res) => {
        
    try{
        const values = req.body;
        console.log(values, 35678)
    const username = req.query.username;
    const user = await findUserByUsername(username);
    if(!user){

        return errorResponse(res, "", 404, USER_NOT_FOUND)
    }
    const address = await addAddress(username, values)
    if(!address){
        return errorResponse(res, "", 404, ADDRESS_NOT_ADDED);
    }
    console.log(address, 90909);
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
        console.error("Error fetching address:", error);
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
        // const findAddress = await UserAddress.findById('67a9c2769649f60a4e82877d');
        console.log(findAddress);
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
    return successResponse(res, "deleted", 200);
}catch(error){
    return errorResponse(res, "", 500, error.message)
}
}

export {createUser, getUserDetails, userLogin, forgotPassword, userAddress, getUserAddress, getAddressToEdit, editUserAddress, deleteAddress};
