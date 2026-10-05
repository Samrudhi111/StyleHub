import mongoose from 'mongoose';
import User from '../models/User.js';

// ==============================================================================
// User Controller – Handles User Operations via Mongoose with Fallback
// ==============================================================================

let inMemoryUsers = [
  {
    _id: "670014a0f12c3400a12e0001",
    name: "Samrudhi Shinde",
    email: "samrudhi@stylehub.com",
    mobile: "9876543210",
    password: "AdminPassword123#",
    role: "admin",
    createdAt: new Date().toISOString()
  },
  {
    _id: "670014a0f12c3400a12e0002",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    mobile: "9823456781",
    password: "CustomerPassword1#",
    role: "customer",
    createdAt: new Date().toISOString()
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: users.length, data: users });
    }

    const safeUsers = inMemoryUsers.map(({ password, ...u }) => u);
    res.status(200).json({ success: true, count: safeUsers.length, data: safeUsers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, data: user });
    }

    const user = inMemoryUsers.find((u) => u._id === id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...safeUser } = user;
    res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
};

// @desc    Register / Create a new user
// @route   POST /api/users/register (or POST /api/users)
// @access  Public
export const createUser = async (req, res, next) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, mobile, and password are required fields'
      });
    }

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const user = await User.create({
        name,
        email,
        mobile,
        password,
        role: role || 'customer'
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role
        }
      });
    }

    // In-memory registration
    const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const newId = new mongoose.Types.ObjectId().toString();
    const newUser = {
      _id: newId,
      name,
      email,
      mobile,
      password,
      role: role || 'customer',
      createdAt: new Date().toISOString()
    };
    inMemoryUsers.push(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate / Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    if (isDbConnected()) {
      let user = await User.findOne({ email: email.toLowerCase() });

      // If user not in MongoDB yet, check default demo users list
      if (!user) {
        const demoUser = inMemoryUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (demoUser) {
          user = await User.create({
            name: demoUser.name,
            email: demoUser.email,
            mobile: demoUser.mobile,
            password: demoUser.password,
            role: demoUser.role
          });
        }
      }

      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role
        }
      });
    }

    // In-memory authentication
    const user = inMemoryUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
