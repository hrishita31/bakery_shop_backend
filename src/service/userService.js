import User from '../model/userModel.js';
import {ENTER_NEW_USERNAME} from '../message/messages.js';

const addUser = async (username, userData) => {
    const sameUser = await User.exists({username});
    if(sameUser){
        throw new Error(ENTER_NEW_USERNAME);
    }

    const user = new User(userData);
    return await user.save();
};

const findUserByUsername = async (username) => {
    return await User.findOne({username});
};

const validateUser = async (username) => {
    return await User.findOne({ username });
};

const  updatePassword = async(username, {newPassword}) => {
    return await User.findOneAndUpdate({username}, {password:newPassword}, {new:true});
};

export { addUser, findUserByUsername, validateUser, updatePassword };