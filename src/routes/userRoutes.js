const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUser, deleteUser, getAllUsers } = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.use(protect); // All routes below this middleware require authentication

router.get('/profile', getUserProfile);
router.put('/:id', updateUser); // User can update own profile, admin can update any

// Admin only routes
router.use(restrictTo('admin')); // All routes below this middleware require admin role

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;