import mongoose from "mongoose";

const teamRegisterSchema = new mongoose.Schema(
    {
        name: { type:String,  required :true},
        email : { type:String,  required :true},
        phoneNumber : {type:Number, required : true},
        jobRole : {type:String},
        image : {
            filename: { type: String },
            path: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
        isApproved : {type:Boolean},
    }
)

export const TeamRegister = mongoose.model('TeamRegister', teamRegisterSchema, 'teamRegister'); 
