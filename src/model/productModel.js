import mongoose from 'mongoose';

//this is product model
const productSchema = new mongoose.Schema(
    {
        category: { type: String, required: true },
        product: { type: String, required: true },
        dessertName: { type: String },
        image : {
            filename: { type: String },
            path: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
        price: { type: Number, required: true },
        rating: { type: Number },
    }
);

productSchema.pre('save', function (next) {
    this.dessertName = `${this.product} ${this.category}`;
    next();
});

const favProductSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        dessertName: { type: String },
        price:{type:String},
    }
);

const cartProductSchema = new mongoose.Schema(
    {
        username : {type:String, required:true},
        productId : {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity : {type:Number, required:true},
        price: { type: Number},
        totalPrice : {type:Number},
    }
)

const savedCartSchema = new mongoose.Schema(
    {
        username : {type:String},
        
        productId : {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        quantity : {type:Number},
        price: { type: Number},
        totalPrice : {type:Number},
        category: { type: String},
        product: { type: String},
        dessertName: { type: String },
        image : {
            filename: { type: String },
            path: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    }
)

export const Product = mongoose.model('Product', productSchema, 'products');
export const FavProduct = mongoose.model('FavProduct', favProductSchema, 'favProducts');
export const CartProduct = mongoose.model('CartProduct', cartProductSchema, 'cartProducts');
export const SavedCartProduct = mongoose.model('SavedCartProduct', savedCartSchema, 'savedCartProducts');