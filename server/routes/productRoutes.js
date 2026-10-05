import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts
} from '../controllers/productController.js';

// ==============================================================================
// Product Routes – Express Router
// Base Path: /api/products
// ==============================================================================

const router = express.Router();

// GET all products / POST new product
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Helper route to seed catalog
router.post('/seed', seedProducts);

// GET single product / PUT update product / DELETE product
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
