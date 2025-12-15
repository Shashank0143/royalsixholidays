const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ placeId: 1, parentCommentId: 1, createdAt: -1 });
commentSchema.index({ userId: 1, createdAt: -1 });
commentSchema.index({ parentCommentId: 1 });

module.exports = mongoose.model('Comment', commentSchema);