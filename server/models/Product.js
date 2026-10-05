import mongoose from 'mongoose';

// ==============================================================================
// Product Mongoose Model & Schema
// Collection: products
// ==============================================================================

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Men', 'Women', 'Kids', 'Accessories'],
        message: '{VALUE} is not a supported apparel category'
      }
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    size: {
      type: [String],
      required: [true, 'At least one size must be specified'],
      default: ['M']
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Automatically creates createdAt and updatedAt fields
  }
);

// Virtual index for fast search queries
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
