const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
  updateBookingStatusAdmin,
  getBookingStats
} = require('../controllers/bookingController');

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

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', [
  authMiddleware,
  body('destinationId').isMongoId().withMessage('Valid destination ID is required'),
  body('placeId').isMongoId().withMessage('Valid place ID is required'),
  body('bookingDetails.startDate').isISO8601().toDate().withMessage('Valid start date is required'),
  body('bookingDetails.endDate').isISO8601().toDate().withMessage('Valid end date is required'),
  body('bookingDetails.numberOfPeople.adults')
    .isInt({ min: 1 })
    .withMessage('At least 1 adult is required'),
  body('bookingDetails.numberOfPeople.children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Children count must be 0 or more'),
  body('bookingDetails.budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('bookingDetails.packageType')
    .isIn(['budget', 'mid-range', 'luxury'])
    .withMessage('Package type must be budget, mid-range, or luxury'),
  body('contactInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number')
], handleValidationErrors, createBooking);

// @route   GET /api/bookings/user
// @desc    Get user's bookings
// @access  Private
router.get('/user', [
  authMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status')
], handleValidationErrors, getUserBookings);

// @route   GET /api/bookings/stats
// @desc    Get booking statistics
// @access  Private (Admin only)
router.get('/stats', authMiddleware, adminMiddleware, getBookingStats);

// @route   GET /api/bookings/all
// @desc    Get all bookings (Admin only)
// @access  Private (Admin only)
router.get('/all', [
  authMiddleware,
  adminMiddleware,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
  query('userId').optional().isMongoId().withMessage('Invalid user ID'),
  query('destinationId').optional().isMongoId().withMessage('Invalid destination ID')
], handleValidationErrors, getAllBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', authMiddleware, getBookingById);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (User can only cancel)
// @access  Private
router.put('/:id/status', [
  authMiddleware,
  body('status').isIn(['cancelled']).withMessage('Users can only cancel bookings'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
], handleValidationErrors, updateBookingStatus);

// @route   PUT /api/bookings/:id/admin
// @desc    Update booking status and details (Admin only)
// @access  Private (Admin only)
router.put('/:id/admin', [
  authMiddleware,
  adminMiddleware,
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status'),
  body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
], handleValidationErrors, updateBookingStatusAdmin);

module.exports = router;