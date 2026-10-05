import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController.js';

// ==============================================================================
// Order Routes – Express Router
// Base Path: /api/orders
// ==============================================================================

const router = express.Router();

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
