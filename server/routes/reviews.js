const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

const {
  createReview,
  getPlaceReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getUserReviews,
  adminDeleteReview
} = require('../controllers/reviewController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

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

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', [
  authMiddleware,
  body('placeId').isMongoId().withMessage('Valid place ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').notEmpty().trim().withMessage('Review title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('text').notEmpty().trim().withMessage('Review text is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Review text must be between 10 and 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*').optional().isURL().withMessage('All images must be valid URLs')
], handleValidationErrors, createReview);

// @route   GET /api/reviews/place/:placeId
// @desc    Get reviews for a place
// @access  Public
router.get('/place/:placeId', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('sort')
    .optional()
    .isIn(['newest', 'oldest', 'rating-high', 'rating-low', 'helpful'])
    .withMessage('Invalid sort option')
], handleValidationErrors, getPlaceReviews);

// @route   GET /api/reviews/user
// @desc    Get user's reviews
// @access  Private
router.get('/user', [
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], handleValidationErrors, getUserReviews);

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', [
  authMiddleware,
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').optional().notEmpty().trim().withMessage('Review title cannot be empty')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('text').optional().notEmpty().trim().withMessage('Review text cannot be empty')
    .isLength({ min: 10, max: 1000 }).withMessage('Review text must be between 10 and 1000 characters'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('images.*').optional().isURL().withMessage('All images must be valid URLs')
], handleValidationErrors, updateReview);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', authMiddleware, deleteReview);

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful/unhelpful
// @access  Private
router.post('/:id/helpful', authMiddleware, markReviewHelpful);

// @route   DELETE /api/reviews/:id/admin
// @desc    Delete review (Admin only)
// @access  Private (Admin only)
router.delete('/:id/admin', authMiddleware, adminMiddleware, adminDeleteReview);

module.exports = router;