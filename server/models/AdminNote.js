const mongoose = require('mongoose');

const adminNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'bg-yellow-100'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from creation
    expires: 0 // MongoDB TTL - automatically delete after expiresAt
  }
});

// Index to automatically delete expired notes
adminNoteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('AdminNote', adminNoteSchema);