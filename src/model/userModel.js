import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword : { type: String, required: true },
});

const addressSchema = new mongoose.Schema({
    username: { type: String, required: true },
    addressLine1 : { type: String, required: true },
    addressLine2 : { type: String, required: true },
    landmark: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: {type:Number, required:true},
})

export const User = mongoose.model('User', userSchema, 'users'); 
export const UserAddress = mongoose.model('UserAddress', addressSchema, 'userAddress')