const Review = require('../models/Review');
const Place = require('../models/Place');
const Booking = require('../models/Booking');

// Create new review
const createReview = async (req, res) => {
  try {
    const { placeId, rating, title, text, images = [] } = req.body;

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if user already reviewed this place
    const existingReview = await Review.findOne({
      userId: req.user.id,
      placeId,
      isActive: true
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this place' });
    }

    // Optional: Check if user has booked this place
    const hasBooked = await Booking.findOne({
      userId: req.user.id,
      placeId,
      status: { $in: ['confirmed', 'completed'] }
    });

    // Create review
    const review = new Review({
      userId: req.user.id,
      placeId,
      rating,
      title,
      text,
      images,
      verified: !!hasBooked // Mark as verified if user has booked
    });

    await review.save();

    // Update place's average rating
    await updatePlaceRating(placeId);

    // Populate review with user details for response
    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name profileImage')
      .lean();

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error creating review' });
  }
};

// Get reviews for a place
const getPlaceReviews = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;

    // Verify place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    let sortOption = { createdAt: -1 }; // newest first
    
    switch (sort) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'rating-high':
        sortOption = { rating: -1, createdAt: -1 };
        break;
      case 'rating-low':
        sortOption = { rating: 1, createdAt: -1 };
        break;
      case 'helpful':
        sortOption = { helpfulCount: -1, createdAt: -1 };
        break;
    }

    const reviews = await Review.find({ 
      placeId, 
      isActive: true 
    })
    .populate('userId', 'name profileImage')
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    const total = await Review.countDocuments({ placeId, isActive: true });

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { placeId: place._id, isActive: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      }
    ]);

    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: ratingStats.find(stat => stat._id === rating)?.count || 0
    }));

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalReviews: total,
      averageRating: place.averageRating,
      ratingDistribution
    });
  } catch (error) {
    console.error('Get place reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, text, images } = req.body;

    const review = await Review.findOne({
      _id: id,
      userId: req.user.id,
      isActive: true
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or access denied' });
    }

    // Update review
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (text !== undefined) review.text = text;
    if (images !== undefined) review.images = images;

    await review.save();

    // Update place's average rating if rating changed
    if (rating !== undefined) {
      await updatePlaceRating(review.placeId);
    }

    const updatedReview = await Review.findById(id)
      .populate('userId', 'name profileImage');

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error updating review' });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      userId: req.user.id,
      isActive: true
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or access denied' });
    }

    // Soft delete
    review.isActive = false;
    await review.save();

    // Update place's average rating
    await updatePlaceRating(review.placeId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

// Mark review as helpful
const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({ _id: id, isActive: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already marked this review as helpful
    const alreadyMarked = review.helpful.some(
      item => item.userId.toString() === req.user.id
    );

    if (alreadyMarked) {
      // Remove helpful mark
      review.helpful = review.helpful.filter(
        item => item.userId.toString() !== req.user.id
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add helpful mark
      review.helpful.push({ userId: req.user.id });
      review.helpfulCount += 1;
    }

    await review.save();

    res.json({
      message: alreadyMarked ? 'Helpful mark removed' : 'Review marked as helpful',
      isHelpful: !alreadyMarked,
      helpfulCount: review.helpfulCount
    });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({ message: 'Server error marking review as helpful' });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ 
      userId: req.user.id, 
      isActive: true 
    })
    .populate('placeId', 'name images destinationId')
    .populate({
      path: 'placeId',
      populate: {
        path: 'destinationId',
        select: 'name region'
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    const total = await Review.countDocuments({ userId: req.user.id, isActive: true });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalReviews: total
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error fetching user reviews' });
  }
};

// Admin: Delete any review
const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update place's average rating
    await updatePlaceRating(review.placeId);

    res.json({ message: 'Review deleted successfully by admin' });
  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

// Helper function to update place's average rating
const updatePlaceRating = async (placeId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { placeId, isActive: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    const place = await Place.findById(placeId);
    if (place) {
      place.averageRating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
      place.reviewCount = stats.length > 0 ? stats[0].reviewCount : 0;
      await place.save();
    }
  } catch (error) {
    console.error('Update place rating error:', error);
  }
};

module.exports = {
  createReview,
  getPlaceReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getUserReviews,
  adminDeleteReview
};