const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000
  },
  images: [{
    type: String
  }],
  helpful: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  helpfulCount: {
    type: Number,
    default: 0
  },
  verified: {
    type: Boolean,
    default: false // Set to true if user has actually booked and visited
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from same user for same place
reviewSchema.index({ userId: 1, placeId: 1 }, { unique: true });
reviewSchema.index({ placeId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model('Review', reviewSchema);