import mongoose from 'mongoose';
import Product from '../models/Product.js';

// ==============================================================================
// Product Controller – Handles CRUD Operations via Mongoose
// Includes resilient fallback so endpoints respond even when offline
// ==============================================================================

// In-memory catalog store used as immediate fallback when MongoDB is offline
let inMemoryProducts = [
  {
    _id: "670014a0f12c3400a12e0005",
    productId: 1,
    name: "Classic Denim Jacket",
    category: "Men",
    description: "Rugged vintage-washed denim jacket crafted with premium heavy-cotton blend.",
    price: 2499,
    size: ["S", "M", "L", "XL"],
    color: "Indigo Blue",
    stock: 25,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "670014a0f12c3400a12e0006",
    productId: 2,
    name: "Floral Summer Dress",
    category: "Women",
    description: "Breathable chiffon floral wrap dress with waist tie and ruffled hemline.",
    price: 1899,
    size: ["XS", "S", "M", "L"],
    color: "Soft Pink Floral",
    stock: 18,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "670014a0f12c3400a12e0007",
    productId: 3,
    name: "Slim Fit Chinos",
    category: "Men",
    description: "Tailored stretch cotton chinos engineered for all-day comfort and mobility.",
    price: 1599,
    size: ["30", "32", "34", "36"],
    color: "Khaki Tan",
    stock: 30,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&auto=format&fit=crop&q=80",
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "670014a0f12c3400a12e0008",
    productId: 4,
    name: "Oversized Cotton Hoodie",
    category: "Men",
    description: "Heavyweight 400 GSM fleece cotton hoodie with drop-shoulder silhouette.",
    price: 1999,
    size: ["M", "L", "XL", "XXL"],
    color: "Charcoal Heather",
    stock: 15,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80",
    featured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "670014a0f12c3400a12e0009",
    productId: 5,
    name: "High-Waist Wide Leg Trousers",
    category: "Women",
    description: "Contemporary pleated wide-leg trousers tailored with premium viscose blend.",
    price: 2199,
    size: ["S", "M", "L"],
    color: "Jet Black",
    stock: 22,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "670014a0f12c3400a12e000a",
    productId: 6,
    name: "Kids Dino Graphic T-Shirt",
    category: "Kids",
    description: "100% bio-washed organic cotton crew neck t-shirt with playful glow print.",
    price: 699,
    size: ["4-5Y", "6-7Y", "8-9Y"],
    color: "Olive Green",
    stock: 40,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80",
    featured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "670014a0f12c3400a12e000b",
    productId: 7,
    name: "Italian Leather Reversible Belt",
    category: "Accessories",
    description: "Genuine full-grain Italian leather belt featuring a 360-degree rotating buckle.",
    price: 1299,
    size: ["Free Size"],
    color: "Black / Brown",
    stock: 50,
    image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80",
    featured: true,
    createdAt: new Date().toISOString()
  }
];

// Helper to check if Mongoose has active connected state
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all products (with optional category and search filters)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    if (isDbConnected()) {
      // Auto-provision initial catalog in Atlas if database is fresh
      const totalCount = await Product.countDocuments();
      if (totalCount === 0) {
        console.log('[Auto-Seed] Initializing empty MongoDB database with StyleHub catalog...');
        await Product.insertMany(inMemoryProducts);
      }

      let query = {};
      if (category && category !== 'All') query.category = category;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const products = await Product.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: products.length, data: products });
    }

    // In-memory fallback
    let results = [...inMemoryProducts];
    if (category && category !== 'All') {
      results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
      source: 'live-store-catalog'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID (MongoDB _id or numerical productId)
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let product;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      } else if (!isNaN(Number(id))) {
        product = await Product.findOne({ productId: Number(id) });
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found in catalog`
        });
      }
      return res.status(200).json({ success: true, data: product });
    }

    // In-memory fallback
    const product = inMemoryProducts.find(
      (p) => p._id === id || String(p.productId) === String(id)
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found in catalog`
      });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product document
// @route   POST /api/products
// @access  Public
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      price,
      size,
      color,
      stock,
      image,
      featured,
      productId
    } = req.body;

    if (!name || !category || price === undefined || !color) {
      return res.status(400).json({
        success: false,
        message: 'Product name, category, price, and color are required fields'
      });
    }

    const formattedSize = Array.isArray(size)
      ? size
      : typeof size === 'string'
      ? size.split(',').map((s) => s.trim())
      : ['M'];

    if (isDbConnected()) {
      let assignedProductId = productId;
      if (!assignedProductId) {
        const highestProduct = await Product.findOne().sort({ productId: -1 });
        assignedProductId = highestProduct && highestProduct.productId ? highestProduct.productId + 1 : 1;
      }

      const product = await Product.create({
        productId: assignedProductId,
        name,
        category,
        description: description || 'Premium StyleHub apparel item.',
        price: Number(price),
        size: formattedSize,
        color,
        stock: Number(stock || 0),
        image: image || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600',
        featured: Boolean(featured)
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    }

    // In-memory creation
    const newId = new mongoose.Types.ObjectId().toString();
    const newProductId = productId || (inMemoryProducts.length + 1);
    const newProduct = {
      _id: newId,
      productId: Number(newProductId),
      name,
      category,
      description: description || 'Premium StyleHub apparel item.',
      price: Number(price),
      size: formattedSize,
      color,
      stock: Number(stock || 0),
      image: image || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600',
      featured: Boolean(featured),
      createdAt: new Date().toISOString()
    };

    inMemoryProducts.unshift(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product (e.g. price and stock)
// @route   PUT /api/products/:id
// @access  Public
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { productId: Number(id) };

      if (req.body.size && typeof req.body.size === 'string') {
        req.body.size = req.body.size.split(',').map((s) => s.trim());
      }

      const updatedProduct = await Product.findOneAndUpdate(
        query,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    }

    // In-memory update
    const index = inMemoryProducts.findIndex(
      (p) => p._id === id || String(p.productId) === String(id)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }

    inMemoryProducts[index] = {
      ...inMemoryProducts[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: inMemoryProducts[index]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product document
// @route   DELETE /api/products/:id
// @access  Public
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      let query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { productId: Number(id) };
      const product = await Product.findOneAndDelete(query);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID '${id}' not found`
        });
      }
      return res.status(200).json({
        success: true,
        message: `Product '${product.name}' (ID: ${id}) removed successfully`,
        data: {}
      });
    }

    // In-memory deletion
    const index = inMemoryProducts.findIndex(
      (p) => p._id === id || String(p.productId) === String(id)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }

    const removed = inMemoryProducts.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: `Product '${removed.name}' (ID: ${id}) removed successfully`,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed initial catalog products
// @route   POST /api/products/seed
// @access  Public
export const seedProducts = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      await Product.deleteMany({});
      const inserted = await Product.insertMany(inMemoryProducts);
      return res.status(201).json({
        success: true,
        message: `Database populated with ${inserted.length} StyleHub products`,
        data: inserted
      });
    }

    res.status(200).json({
      success: true,
      message: `Catalog active with ${inMemoryProducts.length} items`,
      data: inMemoryProducts
    });
  } catch (error) {
    next(error);
  }
};
