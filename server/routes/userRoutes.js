import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  loginUser
} from '../controllers/userController.js';

// ==============================================================================
// User Routes – Express Router
// Base Path: /api/users
// ==============================================================================

const router = express.Router();

router.route('/')
  .get(getUsers)
  .post(createUser);

router.post('/register', createUser);
router.post('/login', loginUser);

router.route('/:id')
  .get(getUserById);

export default router;
