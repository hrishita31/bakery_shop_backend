import User from '../model/userModel.js';
import {ENTER_NEW_USERNAME} from '../message/messages.js';

const addUser = async (username, userData) => {
    console.log(username, 123, userData)
    const sameUser = await User.exists({username});
    console.log(sameUser,8988);
    if(sameUser){
        throw new Error(ENTER_NEW_USERNAME);
    }

    const user = await new User(userData);
    console.log(user, 456)
    return await user.save();
};

const findUserByUsername = async (username) => {
    return await User.findOne({username});
};

const validateUser = async (username) => {
    return await User.findOne({ username });
};

const  updatePassword = async(username, {newPassword}, {confirmnewPassword}) => {
    return await User.findOneAndUpdate({username}, {confirmPassword:newPassword}, {confirmPassword:confirmnewPassword}, {new:true});
};

export { addUser, findUserByUsername, validateUser, updatePassword };