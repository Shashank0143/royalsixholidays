const mongoose = require('mongoose');

const privacyNoteSchema = new mongoose.Schema({
  // Use a fixed identifier for the single privacy note
  noteId: {
    type: String,
    default: 'privacy_notepad',
    unique: true
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
privacyNoteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PrivacyNote', privacyNoteSchema);
