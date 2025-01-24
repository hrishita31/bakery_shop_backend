import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: { type:String,  required :true},
        email : { type:String,  required :true},
        phoneNumber : {type:Number, required : true},
        jobRole : {type:String},
        
    }
)

export default mongoose.model('Team', teamSchema, 'team'); 
