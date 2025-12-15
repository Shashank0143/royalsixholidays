const express = require('express');
const router = express.Router();
const AdminNote = require('../models/AdminNote');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/admin/note
// @desc    Get admin note
// @access  Private (Admin only)
router.get('/note', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.email !== 'VB5100@gmail.com' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const note = await AdminNote.findOne({ userId: req.user.id });
    
    if (!note) {
      return res.json({
        content: '',
        color: 'bg-yellow-100',
        createdAt: null,
        expiresAt: null
      });
    }

    res.json({
      content: note.content,
      color: note.color,
      createdAt: note.createdAt,
      expiresAt: note.expiresAt
    });
  } catch (error) {
    console.error('Error fetching admin note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/admin/note
// @desc    Save or update admin note
// @access  Private (Admin only)
router.post('/note', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.email !== 'VB5100@gmail.com' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { content, color } = req.body;
    
    // Find existing note or create new one
    let note = await AdminNote.findOne({ userId: req.user.id });
    
    if (note) {
      // Update existing note
      note.content = content || '';
      note.color = color || 'bg-yellow-100';
      note.createdAt = new Date();
      note.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Reset 24h timer
    } else {
      // Create new note
      note = new AdminNote({
        userId: req.user.id,
        content: content || '',
        color: color || 'bg-yellow-100'
      });
    }

    await note.save();

    res.json({
      message: 'Note saved successfully',
      content: note.content,
      color: note.color,
      createdAt: note.createdAt,
      expiresAt: note.expiresAt
    });
  } catch (error) {
    console.error('Error saving admin note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/note
// @desc    Delete admin note
// @access  Private (Admin only)
router.delete('/note', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.email !== 'VB5100@gmail.com' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    await AdminNote.findOneAndDelete({ userId: req.user.id });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;