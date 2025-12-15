const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

const {
  createComment,
  getPlaceComments,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getUserComments,
  adminDeleteComment
} = require('../controllers/commentController');

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

// @route   POST /api/comments
// @desc    Create new comment
// @access  Private
router.post('/', [
  authMiddleware,
  body('placeId').isMongoId().withMessage('Valid place ID is required'),
  body('text').notEmpty().trim().withMessage('Comment text is required')
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters'),
  body('parentCommentId').optional().isMongoId().withMessage('Valid parent comment ID required')
], handleValidationErrors, createComment);

// @route   GET /api/comments/place/:placeId
// @desc    Get comments for a place
// @access  Public
router.get('/place/:placeId', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], handleValidationErrors, getPlaceComments);

// @route   GET /api/comments/user
// @desc    Get user's comments
// @access  Private
router.get('/user', [
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], handleValidationErrors, getUserComments);

// @route   PUT /api/comments/:id
// @desc    Update comment
// @access  Private
router.put('/:id', [
  authMiddleware,
  body('text').notEmpty().trim().withMessage('Comment text is required')
    .isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters')
], handleValidationErrors, updateComment);

// @route   DELETE /api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete('/:id', authMiddleware, deleteComment);

// @route   POST /api/comments/:id/like
// @desc    Like/unlike comment
// @access  Private
router.post('/:id/like', authMiddleware, toggleCommentLike);

// @route   DELETE /api/comments/:id/admin
// @desc    Delete comment (Admin only)
// @access  Private (Admin only)
router.delete('/:id/admin', authMiddleware, adminMiddleware, adminDeleteComment);

module.exports = router;