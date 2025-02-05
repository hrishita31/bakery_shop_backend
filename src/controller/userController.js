import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';

import '../model/userModel.js';
import { addUser, findUserByUsername, validateUser, findDecodedUser, updatePassword } from '../service/userService.js';
import { createTokenMiddleware } from '../middleware/middleware.js';
import { MISSING_PARAMETER, INVALID_CREDENTIALS, INVALID_PASSWORD, INVALID_EMAIL, MISSING_NEW_PASSWORD,USER_NOT_FOUND, PASSWORD_UPDATED, PASSWORDS_NOT_MATCHING } from '../message/messages.js';
import { successResponse, errorResponse } from '../response/response.js';
import { sendMail } from '../middleware/sendMail.js';
import { forgotPasswordResponse } from '../response/forgotPasswordResponse.js';

import User from '../model/userModel.js';

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

        const token = createTokenMiddleware({ userId: user._id, username: user.username });

        return successResponse(res, token, 200);
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

export {createUser, getUserDetails, userLogin, forgotPassword};
