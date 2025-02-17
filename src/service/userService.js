import {User, UserAddress, UserProfile} from '../model/userModel.js';
import {ENTER_NEW_USERNAME} from '../message/messages.js';

const addUser = async (username, userData) => {
    const sameUser = await User.exists({username});
    if(sameUser){
        throw new Error(ENTER_NEW_USERNAME);
    }
    const user = await new User(userData);
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

const addAddress = async(username, addressData) => {
    const address = await new UserAddress({username, ...addressData});
    return await address.save();
}

const findAddress = async(username) => {
    return await UserAddress.find({ username });
}

const checkAddressExists = async(addressId) => {
    return await UserAddress.findById(addressId);
}

const updateAddress = async(_id, values) => {
    return await UserAddress.findOneAndUpdate({_id:_id}, values);
}

const addressToBin = async(addressId) => {
    return await UserAddress.deleteOne({_id: addressId});
}

const checkProfile = async(username) => {
    const profile = await UserProfile.findOne({username});
    return profile;
}

const addProfile = async({username:username}, {image:image}) => {
    const profile= await UserProfile.findOneAndUpdate({username:username}, {image:image}, {returnDocument:'after'})
    return profile;
}

export { addUser, findUserByUsername, validateUser, findDecodedUser,  updatePassword, addAddress, findAddress, checkAddressExists, updateAddress, addressToBin, checkProfile, addProfile };