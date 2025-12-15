const express = require('express');
const { body, query, validationResult } = require('express-validator');
const router = express.Router();

const {
  getAllDestinations,
  getDestinationById,
  getRegions,
  createDestination,
  updateDestination,
  deleteDestination
} = require('../controllers/destinationController');

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

// @route   GET /api/destinations
// @desc    Get all destinations with pagination and filtering
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('featured').optional().isBoolean().withMessage('Featured must be boolean')
], handleValidationErrors, getAllDestinations);

// @route   GET /api/destinations/regions
// @desc    Get all unique regions
// @access  Public
router.get('/regions', getRegions);

// @route   GET /api/destinations/:id
// @desc    Get single destination by ID with places
// @access  Public
router.get('/:id', getDestinationById);

// @route   POST /api/destinations
// @desc    Create new destination
// @access  Private (Admin only)
router.post('/', [
  authMiddleware,
  adminMiddleware,
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('image').isURL().withMessage('Image must be a valid URL'),
  body('region').notEmpty().trim().withMessage('Region is required'),
  body('coordinates.lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('coordinates.lng').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('overview.culture').notEmpty().trim().withMessage('Culture information is required'),
  body('overview.bestTimeToVisit').notEmpty().trim().withMessage('Best time to visit is required'),
  body('overview.language').notEmpty().trim().withMessage('Language is required')
], handleValidationErrors, createDestination);

// @route   PUT /api/destinations/:id
// @desc    Update destination
// @access  Private (Admin only)
router.put('/:id', [
  authMiddleware,
  adminMiddleware,
  body('name').optional().notEmpty().trim().withMessage('Name cannot be empty'),
  body('description').optional().notEmpty().trim().withMessage('Description cannot be empty'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('region').optional().notEmpty().trim().withMessage('Region cannot be empty'),
  body('coordinates.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('coordinates.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180')
], handleValidationErrors, updateDestination);

// @route   DELETE /api/destinations/:id
// @desc    Delete destination (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, deleteDestination);

module.exports = router;