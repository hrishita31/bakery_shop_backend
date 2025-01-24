import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        name : {type:String, required : true},
        location : {type:String, required : true},
        rating: {type:String, required : true},
        quote: {type:String, required : true},
        image : {
            filename: { type: String },
            path: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    }
)

export default mongoose.model('Testimonial', testimonialSchema, "testimonies");
