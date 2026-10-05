import mongoose from 'mongoose';
import Order from '../models/Order.js';

// ==============================================================================
// Order Controller – Handles Order Processing via Mongoose with Fallback
// ==============================================================================

let inMemoryOrders = [
  {
    _id: "670014a0f12c3400a12e0010",
    orderId: "ORD-2026-1001",
    userId: "aarav.sharma@example.com",
    products: [
      {
        productId: 1,
        name: "Classic Denim Jacket",
        size: "L",
        quantity: 1,
        unitPrice: 2499
      },
      {
        productId: 3,
        name: "Slim Fit Chinos",
        size: "32",
        quantity: 1,
        unitPrice: 1599
      }
    ],
    totalAmount: 4098,
    orderDate: new Date("2026-10-02T14:20:00Z").toISOString(),
    status: "Delivered",
    shippingAddress: {
      street: "42 Park Avenue, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050"
    }
  },
  {
    _id: "670014a0f12c3400a12e0011",
    orderId: "ORD-2026-1002",
    userId: "priya.nair@example.com",
    products: [
      {
        productId: 2,
        name: "Floral Summer Dress",
        size: "M",
        quantity: 2,
        unitPrice: 1899
      }
    ],
    totalAmount: 3798,
    orderDate: new Date("2026-10-02T16:10:00Z").toISOString(),
    status: "Processing",
    shippingAddress: {
      street: "18 MG Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038"
    }
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
export const getOrders = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: orders.length, data: orders });
    }

    res.status(200).json({ success: true, count: inMemoryOrders.length, data: inMemoryOrders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or orderId string
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { orderId: id };
      const order = await Order.findOne(query);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.status(200).json({ success: true, data: order });
    }

    const order = inMemoryOrders.find((o) => o._id === id || o.orderId === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req, res, next) => {
  try {
    const { userId, products, totalAmount, shippingAddress } = req.body;

    if (!userId || !products || !products.length || totalAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'userId, products array, and totalAmount are required fields'
      });
    }

    const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    if (isDbConnected()) {
      const order = await Order.create({
        orderId: generatedOrderId,
        userId,
        products,
        totalAmount,
        shippingAddress
      });

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: order
      });
    }

    const newId = new mongoose.Types.ObjectId().toString();
    const newOrder = {
      _id: newId,
      orderId: generatedOrderId,
      userId,
      products,
      totalAmount,
      orderDate: new Date().toISOString(),
      status: "Processing",
      shippingAddress: shippingAddress || {}
    };
    inMemoryOrders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status field is required' });
    }

    if (isDbConnected()) {
      let query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { orderId: id };
      const order = await Order.findOneAndUpdate(
        query,
        { $set: { status } },
        { new: true, runValidators: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.status(200).json({ success: true, message: 'Order status updated', data: order });
    }

    const order = inMemoryOrders.find((o) => o._id === id || o.orderId === id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    res.status(200).json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    next(error);
  }
};
