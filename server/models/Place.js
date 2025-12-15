const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  details: {
    culture: {
      type: String,
      required: true
    },
    famousFood: [{
      name: String,
      description: String,
      image: String
    }],
    dance: {
      type: String,
      required: true
    },
    dress: {
      type: String,
      required: true
    },
    bestTimeToVisit: {
      type: String,
      required: true
    },
    placesToVisit: [{
      name: String,
      description: String,
      image: String,
      entryFee: Number
    }]
  },
  cost: {
    budget: {
      type: Number,
      required: true
    },
    midRange: {
      type: Number,
      required: true
    },
    luxury: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  hotels: [{
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    priceRange: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      required: true
    },
    amenities: [String],
    contact: String,
    location: String,
    image: String
  }],
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
placeSchema.index({ name: 'text', description: 'text' });
placeSchema.index({ destinationId: 1 });
placeSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Place', placeSchema);