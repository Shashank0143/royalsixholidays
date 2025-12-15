const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  googleLogin,
  getProfile,
  updateProfile
} = require('../controllers/authController');

const authMiddleware = require('../middleware/authMiddleware');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register user with email and password
// @access  Public
router.post('/register', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone').optional().isLength({ min: 10, max: 15 }).withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
], handleValidationErrors, register);

// @route   POST /api/auth/login
// @desc    Login user with email and password
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], handleValidationErrors, login);

// @route   POST /api/auth/google
// @desc    Google OAuth login
// @access  Public
router.post('/google', [
  body('credential').notEmpty().withMessage('Google credential is required')
], handleValidationErrors, googleLogin);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  authMiddleware,
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('profileImage').optional().isURL().withMessage('Profile image must be a valid URL')
], handleValidationErrors, updateProfile);

// @route   POST /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private
router.post('/verify-token', authMiddleware, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isSubscribed: req.user.isSubscribed,
      role: req.user.role
    }
  });
});

module.exports = router;