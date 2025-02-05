import User from '../model/userModel.js';
import {ENTER_NEW_USERNAME} from '../message/messages.js';

const addUser = async (username, userData) => {
    const sameUser = await User.exists({username});
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

const findDecodedUser = async(username) => {
    return await User.findOne({username});
}

const  updatePassword = async({username:username}, {password:newhashedPassword, confirmPassword:newconfirmPassword}) => {
    return await User.findOneAndUpdate({username:username}, {password:newhashedPassword, confirmPassword:newconfirmPassword}, {new:true});
};

export { addUser, findUserByUsername, validateUser, findDecodedUser,  updatePassword };