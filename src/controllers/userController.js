const { User } = require('../models');
const { generateToken } = require('../utils/jwtUtils');
const { AppError, catchAsync } = require('../utils/errorHandler');
const { isValidEmail, isStrongPassword } = require('../utils/validation');

/**
 * Register a new user
 * @route POST /api/users/register
 */

const registerUser = catchAsync(async (req, res, next) => {
  const { userName, userEmail, userPhone, userPassword, userRole } = req.body;

  // Validate input
  if (!userName || !userEmail || !userPassword) {
    return next(new AppError('Please provide name, email and password', 400));
  }

  if (!isValidEmail(userEmail)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  if (!isStrongPassword(userPassword)) {
    return next(new AppError('Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number', 400));
  }

  // Check if user already exists
  const userExists = await User.findOne({ where: { userEmail } });
  if (userExists) {
    return next(new AppError('User already exists', 400));
  }

  // Create user
  const user = await User.create({
    userName,
    userEmail,
    userPhone,
    userPassword,
    userRole: userRole === 'admin' ? 'admin' : 'user' // Default to 'user' unless explicitly set to 'admin'
  });

  // Generate token
  const token = generateToken(user);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        userID: user.userID,
        userName: user.userName,
        userEmail: user.userEmail,
        userPhone: user.userPhone,
        userRole: user.userRole,
        createdAt: user.createdAt
      }
    }
  });
});

/**
 * Login user
 * @route POST /api/users/login
 */
const loginUser = catchAsync(async (req, res, next) => {
  const { userEmail, userPassword } = req.body;

  // Validate input
  if (!userEmail || !userPassword) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Find user
  const user = await User.findOne({ where: { userEmail } });
  if (!user || !(await user.isValidPassword(userPassword))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // Generate token
  const token = generateToken(user);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        userID: user.userID,
        userName: user.userName,
        userEmail: user.userEmail,
        userPhone: user.userPhone,
        userRole: user.userRole,
        createdAt: user.createdAt
      }
    }
  });
});

/**
 * Get user profile
 * @route GET /api/users/profile
 */
const getUserProfile = catchAsync(async (req, res, next) => {
  // User is already available from auth middleware
  const user = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        userID: user.userID,
        userName: user.userName,
        userEmail: user.userEmail,
        userPhone: user.userPhone,
        userRole: user.userRole,
        createdAt: user.createdAt
      }
    }
  });
});

/**
 * Update user
 * @route PUT /api/users/:id
 */
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userName, userEmail, userPhone, userPassword, userRole } = req.body;

  // Check if user exists
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check permissions - only admin can update other users or change roles
  if (req.user.userID != id && req.user.userRole !== 'admin') {
    return next(new AppError('You do not have permission to update this user', 403));
  }

  // Only admin can change roles
  if (userRole && req.user.userRole !== 'admin') {
    return next(new AppError('You do not have permission to change user roles', 403));
  }

  // Validate email if provided
  if (userEmail && !isValidEmail(userEmail)) {
    return next(new AppError('Please provide a valid email', 400));
  }

  // Validate password if provided
  if (userPassword && !isStrongPassword(userPassword)) {
    return next(new AppError('Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number', 400));
  }

  // Update user
  await user.update({
    userName: userName || user.userName,
    userEmail: userEmail || user.userEmail,
    userPhone: userPhone || user.userPhone,
    userPassword: userPassword || user.userPassword,
    userRole: userRole || user.userRole
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        userID: user.userID,
        userName: user.userName,
        userEmail: user.userEmail,
        userPhone: user.userPhone,
        userRole: user.userRole,
        createdAt: user.createdAt
      }
    }
  });
});

/**
 * Delete user
 * @route DELETE /api/users/:id
 */
const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if user exists
  const user = await User.findByPk(id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Delete user
  await user.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Get all users
 * @route GET /api/users
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['userID', 'userName', 'userEmail', 'userPhone', 'userRole', 'createdAt']
  });

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUser,
  getAllUsers
};