import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import '../model/userModel.js';
import { addUser, findUserByUsername, validateUser, findDecodedUser, updatePassword, addAddress, findAddress, checkAddressExists, updateAddress, addressToBin, addProfile, checkProfile} from '../service/userService.js';
import { createTokenMiddleware } from '../middleware/middleware.js';
import { PROFILE_NOT_ADDED, MISSING_PARAMETER, INVALID_CREDENTIALS, INVALID_PASSWORD, INVALID_EMAIL, USER_NOT_FOUND, PASSWORD_UPDATED, PASSWORDS_NOT_MATCHING, ADDRESS_NOT_ADDED, ADDRESS_NOT_EXIST, ADDRESS_NOT_UPDATED, ADDRESS_NOT_DELETED, PROFILE_EXISTS } from '../message/messages.js';
import { successResponse, errorResponse } from '../response/response.js';
import { sendMail } from '../middleware/sendMail.js';

const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, confirmPassword} = req.body;
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
        if (!user) {
            return errorResponse(res, "", 404, USER_NOT_FOUND)
        }
        const email = user.email;
        await sendMail(user);
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
    return successResponse(res, "deleted", 200);
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
            return errorResponse(res, "", 404, "no profile picture")
        }
        return successResponse(res, profile, 200);
    }catch(error){
        return errorResponse(res, "", 500, error.message)
    }


}

export {createUser, getUserDetails, userLogin, forgotPassword, userAddress, getUserAddress, getAddressToEdit, editUserAddress, deleteAddress, addProfilePicture, displayProfilePicture};
