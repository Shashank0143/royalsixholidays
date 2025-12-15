const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

const {
  getPlaceById,
  getPlacesByDestination,
  searchPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  getFeaturedPlaces
} = require('../controllers/placeController');

const authMiddleware = require('../middleware/authMiddleware');
const subscriptionMiddleware = require('../middleware/subscriptionMiddleware');
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

// @route   GET /api/places/featured
// @desc    Get featured places
// @access  Public
router.get('/featured', [
  query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
], handleValidationErrors, getFeaturedPlaces);

// @route   GET /api/places/search
// @desc    Search places
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], handleValidationErrors, searchPlaces);

// @route   GET /api/places/destination/:destinationId
// @desc    Get places by destination ID
// @access  Public
router.get('/destination/:destinationId', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('featured').optional().isBoolean().withMessage('Featured must be boolean')
], handleValidationErrors, getPlacesByDestination);

// @route   GET /api/places/:id
// @desc    Get single place by ID (Protected - requires subscription)
// @access  Private (Subscribed users only)
router.get('/:id', authMiddleware, subscriptionMiddleware, getPlaceById);

// @route   POST /api/places
// @desc    Create new place
// @access  Private (Admin only)
router.post('/', [
  authMiddleware,
  adminMiddleware,
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('destinationId').isMongoId().withMessage('Valid destination ID is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*').isURL().withMessage('All images must be valid URLs'),
  body('coordinates.lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('coordinates.lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('details.culture').notEmpty().trim().withMessage('Culture information is required'),
  body('details.dance').notEmpty().trim().withMessage('Dance information is required'),
  body('details.dress').notEmpty().trim().withMessage('Dress information is required'),
  body('details.bestTimeToVisit').notEmpty().trim().withMessage('Best time to visit is required'),
  body('cost.budget').isFloat({ min: 0 }).withMessage('Budget cost must be a positive number'),
  body('cost.midRange').isFloat({ min: 0 }).withMessage('Mid-range cost must be a positive number'),
  body('cost.luxury').isFloat({ min: 0 }).withMessage('Luxury cost must be a positive number')
], handleValidationErrors, createPlace);

// @route   PUT /api/places/:id
// @desc    Update place
// @access  Private (Admin only)
router.put('/:id', [
  authMiddleware,
  adminMiddleware,
  body('name').optional().notEmpty().trim().withMessage('Name cannot be empty'),
  body('destinationId').optional().isMongoId().withMessage('Valid destination ID is required'),
  body('description').optional().notEmpty().trim().withMessage('Description cannot be empty'),
  body('images').optional().isArray({ min: 1 }).withMessage('At least one image is required'),
  body('images.*').optional().isURL().withMessage('All images must be valid URLs'),
  body('coordinates.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('coordinates.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('cost.budget').optional().isFloat({ min: 0 }).withMessage('Budget cost must be a positive number'),
  body('cost.midRange').optional().isFloat({ min: 0 }).withMessage('Mid-range cost must be a positive number'),
  body('cost.luxury').optional().isFloat({ min: 0 }).withMessage('Luxury cost must be a positive number')
], handleValidationErrors, updatePlace);

// @route   DELETE /api/places/:id
// @desc    Delete place (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deletePlace);

module.exports = router;