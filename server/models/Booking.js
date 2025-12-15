const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  bookingDetails: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    numberOfPeople: {
      adults: {
        type: Number,
        required: true,
        min: 1
      },
      children: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    budget: {
      type: Number,
      required: true
    },
    packageType: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      required: true
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: true
    },
    alternatePhone: String,
    specialRequests: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'bookingDetails.startDate': 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);