import mongoose from 'mongoose';

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
        rating: { type: String },
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
    }
);

const cartProductSchema = new mongoose.Schema(
    {
        username : {type:String, required:true},
        productId : {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        // quantity : {type:Number, required:true},
    }
)

export const Product = mongoose.model('Product', productSchema, 'products');
export const FavProduct = mongoose.model('FavProduct', favProductSchema, 'favProducts');
export const CartProduct = mongoose.model('CartProduct', cartProductSchema, 'cartProducts');

// export default { Product, FavProduct };
