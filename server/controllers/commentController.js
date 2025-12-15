const Comment = require('../models/Comment');
const Place = require('../models/Place');

// Create new comment
const createComment = async (req, res) => {
  try {
    const { placeId, text, parentCommentId = null } = req.body;

    // Check if place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // If replying to a comment, check if parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findOne({
        _id: parentCommentId,
        placeId,
        isActive: true
      });

      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    // Create comment
    const comment = new Comment({
      userId: req.user.id,
      placeId,
      text,
      parentCommentId
    });

    await comment.save();

    // If this is a reply, add it to parent's replies array
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(
        parentCommentId,
        { $push: { replies: comment._id } }
      );
    }

    // Populate comment with user details for response
    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'name profileImage')
      .lean();

    res.status(201).json({
      message: 'Comment created successfully',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error creating comment' });
  }
};

// Get comments for a place
const getPlaceComments = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verify place exists
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Get top-level comments (no parent)
    const comments = await Comment.find({
      placeId,
      parentCommentId: null,
      isActive: true
    })
    .populate('userId', 'name profileImage')
    .populate({
      path: 'replies',
      populate: {
        path: 'userId',
        select: 'name profileImage'
      },
      match: { isActive: true },
      options: { sort: { createdAt: 1 } }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

    const total = await Comment.countDocuments({
      placeId,
      parentCommentId: null,
      isActive: true
    });

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalComments: total
    });
  } catch (error) {
    console.error('Get place comments error:', error);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
};

// Update comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findOne({
      _id: id,
      userId: req.user.id,
      isActive: true
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or access denied' });
    }

    // Update comment
    comment.text = text;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();

    const updatedComment = await Comment.findById(id)
      .populate('userId', 'name profileImage');

    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ message: 'Server error updating comment' });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOne({
      _id: id,
      userId: req.user.id,
      isActive: true
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or access denied' });
    }

    // Soft delete comment and its replies
    await Comment.updateMany(
      { $or: [{ _id: id }, { parentCommentId: id }] },
      { isActive: false }
    );

    // Remove from parent's replies array if this is a reply
    if (comment.parentCommentId) {
      await Comment.findByIdAndUpdate(
        comment.parentCommentId,
        { $pull: { replies: id } }
      );
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};

// Like/unlike comment
const toggleCommentLike = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findOne({ _id: id, isActive: true });
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user already liked this comment
    const alreadyLiked = comment.likes.some(
      like => like.userId.toString() === req.user.id
    );

    if (alreadyLiked) {
      // Remove like
      comment.likes = comment.likes.filter(
        like => like.userId.toString() !== req.user.id
      );
      comment.likesCount = Math.max(0, comment.likesCount - 1);
    } else {
      // Add like
      comment.likes.push({ userId: req.user.id });
      comment.likesCount += 1;
    }

    await comment.save();

    res.json({
      message: alreadyLiked ? 'Like removed' : 'Comment liked',
      isLiked: !alreadyLiked,
      likesCount: comment.likesCount
    });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({ message: 'Server error toggling comment like' });
  }
};

// Get user's comments
const getUserComments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({
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

    const total = await Comment.countDocuments({ userId: req.user.id, isActive: true });

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalComments: total
    });
  } catch (error) {
    console.error('Get user comments error:', error);
    res.status(500).json({ message: 'Server error fetching user comments' });
  }
};

// Admin: Delete any comment
const adminDeleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Also delete replies if this is a parent comment
    await Comment.updateMany(
      { parentCommentId: id },
      { isActive: false }
    );

    // Remove from parent's replies array if this is a reply
    if (comment.parentCommentId) {
      await Comment.findByIdAndUpdate(
        comment.parentCommentId,
        { $pull: { replies: id } }
      );
    }

    res.json({ message: 'Comment deleted successfully by admin' });
  } catch (error) {
    console.error('Admin delete comment error:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};

module.exports = {
  createComment,
  getPlaceComments,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getUserComments,
  adminDeleteComment
};