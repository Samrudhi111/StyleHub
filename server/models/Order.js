import mongoose from 'mongoose';

// ==============================================================================
// Order Mongoose Model & Schema
// Collection: orders
// ==============================================================================

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'M'
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    unitPrice: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: String,
      required: [true, 'Customer email or user identifier is required']
    },
    products: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    orderDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
