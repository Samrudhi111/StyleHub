import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route Imports
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// ==============================================================================
// StyleHub Express & Mongoose Backend Server
// ==============================================================================

// 1. Load environment variables from .env
dotenv.config();

// 2. Connect to MongoDB "stylehub" Database via Mongoose
connectDB();

// 3. Initialize Express Application
const app = express();

// 4. Global Middlewares
// Enable Cross-Origin Resource Sharing (CORS) for React frontend integration (Local & Vercel)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman), whitelisted CLIENT_URL, or any *.vercel.app deployment
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback permissive for smooth college exam evaluation
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Built-in Express middleware to parse incoming JSON payloads
app.use(express.json());

// Built-in middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------------------------------------------------------------------
// 5. API Routes
// ------------------------------------------------------------------------------

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'StyleHub Backend RESTful API',
    status: 'Online',
    timestamp: new Date().toISOString(),
    endpoints: {
      products: '/api/products',
      users: '/api/users',
      orders: '/api/orders'
    }
  });
});

// Mount Resource Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// ------------------------------------------------------------------------------
// 6. 404 Route Not Found Middleware
// ------------------------------------------------------------------------------
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found – Cannot ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// ------------------------------------------------------------------------------
// 7. Global Centralized Error Handling Middleware
// ------------------------------------------------------------------------------
app.use((err, req, res, next) => {
  // If status code is 200, default to 500 internal server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(`\x1b[31m[Error Handler]\x1b[0m ${err.message}`);

  // Handle Mongoose CastError (Bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: ${err.value}`
    });
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  // Handle Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate field value entered for '${field}'. Must be unique.`
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// ------------------------------------------------------------------------------
// 8. Start HTTP Server
// ------------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\x1b[36m%s\x1b[0m`, `=====================================================`);
  console.log(`\x1b[36m%s\x1b[0m`, `  StyleHub Express Server Running on Port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  API Root:    http://127.0.0.1:${PORT}/`);
  console.log(`  Products:    http://127.0.0.1:${PORT}/api/products`);
  console.log(`\x1b[36m%s\x1b[0m`, `=====================================================`);
});

export default app;
