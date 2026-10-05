import axios from 'axios';

// ==============================================================================
// StyleHub Centralized Axios API Service (Experiment 9)
// Provides clean, promise-based HTTP communication between React and Express REST API
// ==============================================================================

// 1. Base URL loaded dynamically from Vite environment variable (with live Render production fallback)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://stylehub-backend-ja8r.onrender.com/api';

// 2. Configure Axios Instance with defaults
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 3. Response Interceptor for unified error handling & logging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful Axios responses for debugging/demonstration
    console.log(`[Axios Response] ${response.config.method?.toUpperCase()} ${response.config.url} => Status ${response.status}`);
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unable to connect to backend server. Please ensure Express server is running on port 5001.';
    console.error(`[Axios Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, message);
    return Promise.reject(new Error(message));
  }
);

// 4. Product Normalizer: Unifies MongoDB _id and numeric productId for frontend components
export const normalizeProduct = (p) => {
  if (!p) return null;
  const sizeString = Array.isArray(p.size) ? p.size.join(', ') : (p.size || 'M');
  const sizeList = Array.isArray(p.size)
    ? p.size
    : typeof p.size === 'string'
    ? p.size.split(',').map((s) => s.trim())
    : ['M'];

  return {
    ...p,
    id: p.productId || p._id,
    _id: p._id,
    productId: p.productId || p._id,
    size: sizeString,
    sizesArray: sizeList,
    price: Number(p.price || 0),
    stock: Number(p.stock !== undefined ? p.stock : 0)
  };
};

// ==============================================================================
// PRODUCT API ENDPOINTS (GET, POST, PUT, DELETE)
// ==============================================================================

// GET /api/products
export const fetchProducts = async (params = {}) => {
  const response = await apiClient.get('/products', { params });
  const rawList = response.data?.data || response.data?.products || response.data || [];
  return rawList.map(normalizeProduct);
};

// GET /api/products/:id
export const fetchProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  const raw = response.data?.data || response.data;
  return normalizeProduct(raw);
};

// POST /api/products
export const createProduct = async (productData) => {
  const response = await apiClient.post('/products', productData);
  const raw = response.data?.data || response.data;
  return normalizeProduct(raw);
};

// PUT /api/products/:id
export const updateProduct = async (id, productData) => {
  const response = await apiClient.put(`/products/${id}`, productData);
  const raw = response.data?.data || response.data;
  return normalizeProduct(raw);
};

// DELETE /api/products/:id
export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

// ==============================================================================
// USER AUTHENTICATION & PROFILE ENDPOINTS
// ==============================================================================

// POST /api/users/register
export const registerUser = async (userData) => {
  const response = await apiClient.post('/users/register', userData);
  return response.data;
};

// POST /api/users/login
export const loginUser = async (credentials) => {
  const response = await apiClient.post('/users/login', credentials);
  return response.data;
};

// GET /api/users
export const fetchUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data?.data || [];
};

// GET /api/users/:id
export const fetchUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data?.data || response.data;
};

// ==============================================================================
// ORDER MANAGEMENT ENDPOINTS
// ==============================================================================

// POST /api/orders
export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

// GET /api/orders
export const fetchOrders = async () => {
  const response = await apiClient.get('/orders');
  return response.data?.data || [];
};

// GET /api/orders/:id
export const fetchOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data?.data || response.data;
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.put(`/orders/${id}/status`, { status });
  return response.data;
};

export default {
  apiClient,
  normalizeProduct,
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  registerUser,
  loginUser,
  fetchUsers,
  fetchUserById,
  createOrder,
  fetchOrders,
  fetchOrderById,
  updateOrderStatus
};
