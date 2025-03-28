import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword : { type: String, required: true },
    isAdmin : {type:Boolean}
});

const addressSchema = new mongoose.Schema({
    username: { type: String, required: true },
    addressLine1 : { type: String, required: true },
    addressLine2 : { type: String, required: true },
    landmark: { type: String},
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: {type:Number, required:true},
})

const profileSchema = new mongoose.Schema({
    username: { type: String, required: true },
    image : {
        filename: { type: String },
        path: { type: String },
        createdAt: { type: Date, default: Date.now },
    }, 
})

const connectWithUsSchema = new mongoose.Schema({
    name : {type:String, required:true},
    email : {type:String, required:true},
    message : {type:String, required:true},
})

// const orderHistorySchema = new mongoose.Schema({
//     username : {type:String},
            
//             productId : {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
//             quantity : {type:Number},
//             price: { type: Number},
//             totalPrice : {type:Number},
//             dessertName: { type: String },
//     createdAt: { type: Date, default: Date.now },
// })

const orderHistorySchema = new mongoose.Schema({
    username: { type: String, required: true },
    orderId: { type: String, required: true }, // Unique identifier for each transaction
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
            dessertName: { type: String, required: true },
        }
    ],
    createdAt: { type: Date, default: Date.now },
});


export const User = mongoose.model('User', userSchema, 'users'); 
export const UserAddress = mongoose.model('UserAddress', addressSchema, 'userAddress')
export const UserProfile = mongoose.model('UserProfile', profileSchema, 'userProfile')
export const ConnectWithUs = mongoose.model('ConnectWithUs', connectWithUsSchema, 'connectWithUs');
export const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema, 'orderHistory');