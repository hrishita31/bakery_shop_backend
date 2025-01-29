import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
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
    }
)

export default mongoose.model('Team', teamSchema, 'team'); 
