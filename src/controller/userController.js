import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import '../model/userModel.js';
import { addUser, findUserByUsername, validateUser, updatePassword } from '../service/userService.js';
import { createTokenMiddleware } from '../middleware/middleware.js';
import { MISSING_PARAMETER, INVALID_CREDENTIALS, INVALID_PASSWORD, INVALID_EMAIL, MISSING_NEW_PASSWORD, LOGIN_SUCCESSFUL,USER_NOT_FOUND, PASSWORD_UPDATED } from '../message/messages.js';

const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password} = req.query;
        // Ensure all required query parameters are present
        if (!firstname || !lastname || !email || !username || !password) {
            return res.status(400).json({
                success: false,
                message: MISSING_PARAMETER,
            });
        }
        if(!email.includes("@gmail.com")){
            return res.status(400).json({success:false, message: INVALID_EMAIL});
        }

        const hasUpperCase = (password) => {
            for(let i=0; i<password.length; i++){
                let ch=  password.charCodeAt(i);
                if(ch >= 65 && ch <= 90){
                    return true;
                }   
            }
            return false;
        }

        const hasLowerCase = (password) => {
            for(let i=0; i<password.length; i++){
                let ch=  password.charCodeAt(i);
                if(ch >= 97 && ch <= 122){
                    return true;
                }
            }
            return false;
        }
        const hasSpecialChar = (password) => {
            for(let i=0; i<password.length; i++){
                let ch=  password.charCodeAt(i);
                if(
                    !(ch >= 65 && ch <= 90) && // A-Z
                    !(ch >= 97 && ch <= 122) && // a-z
                    !(ch >= 48 && ch <= 57) // 0-9
                ) {
                    return true;
                }
            }
            return false;
        }

        if(password.length<8 || !hasUpperCase(password) || !hasLowerCase(password) || !hasSpecialChar(password)){
            return res.status(400).json({success:false, message:INVALID_PASSWORD});
        }
        
        const hashedPassword = await bcrypt.hash(password, 8);

        const user = await addUser(username, { firstname, lastname, email, username, password:hashedPassword });
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserDetails = async (req, res) => {
    try {

        const { username} = req.query;
        if (!username) {
            return res.status(400).json({
                success: false,
                message: MISSING_PARAMETER,
            });
        }

        const user = await findUserByUsername(username);

        // const user = await findUserByUsername(req.params.username, req.params.password);
        if (!user) {
            return res.status(404).json({ success: false, message: USER_NOT_FOUND });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const userLogin = async(req, res) => {
    const {username, password} = req.query;

    try{
        const user = await validateUser(username, password);
        if(!user) {
            return res.status(401).json({success:false, message:INVALID_CREDENTIALS})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: INVALID_CREDENTIALS });
        }

        const token = createTokenMiddleware({ userId: user._id, username: user.username });

        res.status(200).json({
            success: true,
            message: LOGIN_SUCCESSFUL,
            token,
        });
    }catch(error){
        res.status(500).json({success:false, message:error.message});
    }
}

const forgotPassword = async(req, res) => {
    try{
        const{username} = req.params;
        const {newPassword} = req.body;

        if(!newPassword) { 
            return res.status(400).json(
                {
                    success:false,
                    message:MISSING_NEW_PASSWORD
                }
            )
        }

        const updatedUser = await updatePassword(username, newPassword);

        if(!updatedUser){
            return res.status(404).json(
                {
                    success:false,
                    message:USER_NOT_FOUND,
                }
            )
        }
        res.status(200).json(
            {
                success:true,
                message:PASSWORD_UPDATED
            }
        )
    }catch(error){
        res.status(500).json(
            {
                success: false,
                message : error.message,
            }
        )
    }

}

export {createUser, getUserDetails, userLogin, forgotPassword};
