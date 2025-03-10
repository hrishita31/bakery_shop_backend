import {User, UserAddress, UserProfile, ConnectWithUs} from '../model/userModel.js';
import {ENTER_NEW_USERNAME} from '../message/messages.js';

const addUser = async (username, userData) => {

    const userExists = await User.find();

    const sameUser = await User.exists({username});
    if(sameUser){
        throw new Error(ENTER_NEW_USERNAME);
    }

    if(userExists.length >= 1){
        const user = await new User({...userData, isAdmin : false})
        console.log(user)
        return await user.save();
    }else{

    const user = await new User({...userData, isAdmin:true});
    console.log(user)
    return await user.save();
    }
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

    const profileExists = await UserProfile.findOne({username});
    if(profileExists){
        const profile= await UserProfile.findOneAndUpdate({username:username}, {image:image}, {returnDocument:'after'})
    return profile;
    }else{
        const profile = await new UserProfile({username: username, image:image});
    return await profile.save();
    }
}

const newConnection = async(connectData) => {
    const userConnect = new ConnectWithUs(connectData);
    return await userConnect.save();
}

export { addUser, findUserByUsername, validateUser, findDecodedUser,  updatePassword, addAddress, findAddress, checkAddressExists, updateAddress, addressToBin, checkProfile, addProfile, newConnection};