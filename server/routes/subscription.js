const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const {
  subscribe,
  getSubscriptionStatus,
  cancelSubscription,
  getPlans
} = require('../controllers/subscriptionController');

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

// @route   GET /api/subscription/plans
// @desc    Get available subscription plans
// @access  Public
router.get('/plans', getPlans);

// @route   POST /api/subscription/subscribe
// @desc    Subscribe user to a plan
// @access  Private
router.post('/subscribe', [
  authMiddleware,
  body('planType')
    .isIn(['monthly', 'yearly'])
    .withMessage('Plan type must be either monthly or yearly')
], handleValidationErrors, subscribe);

// @route   GET /api/subscription/status
// @desc    Get current user's subscription status
// @access  Private
router.get('/status', authMiddleware, getSubscriptionStatus);

// @route   DELETE /api/subscription/cancel
// @desc    Cancel current subscription
// @access  Private
router.delete('/cancel', authMiddleware, cancelSubscription);

module.exports = router;