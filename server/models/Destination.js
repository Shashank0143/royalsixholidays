const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
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
  overview: {
    culture: {
      type: String,
      required: true
    },
    bestTimeToVisit: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
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

// Index for search functionality
destinationSchema.index({ name: 'text', description: 'text' });
destinationSchema.index({ region: 1 });

module.exports = mongoose.model('Destination', destinationSchema);