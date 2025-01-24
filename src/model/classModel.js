import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
    {
        name: {type:String, required:true},
        phoneNumber : {type: Number, required:true},
        classTime : {type: String, required:true},
        branch : {type:String, required:true},
    }
)

export default mongoose.model('Class', classSchema, 'class')