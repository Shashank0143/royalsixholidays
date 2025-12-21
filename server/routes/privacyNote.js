const express = require('express');
const router = express.Router();
const PrivacyNote = require('../models/PrivacyNote');

// Privacy code from environment variable
const PRIVACY_CODE = process.env.PRIVACY_CODE || '2611';

// Middleware to verify privacy code
const verifyPrivacyCode = (req, res, next) => {
  const code = req.headers['x-privacy-code'];
  
  if (!code || code !== PRIVACY_CODE) {
    return res.status(403).json({ message: 'Invalid privacy code' });
  }
  
  next();
};

// @route   GET /api/privacy-note
// @desc    Get privacy note
// @access  Protected by privacy code
router.get('/', verifyPrivacyCode, async (req, res) => {
  try {
    const note = await PrivacyNote.findOne({ noteId: 'privacy_notepad' });
    
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
    console.error('Error fetching privacy note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/privacy-note
// @desc    Save or update privacy note
// @access  Protected by privacy code
router.post('/', verifyPrivacyCode, async (req, res) => {
  try {
    const { content, color } = req.body;
    
    // Find existing note or create new one
    let note = await PrivacyNote.findOne({ noteId: 'privacy_notepad' });
    
    if (note) {
      // Update existing note
      note.content = content || '';
      note.color = color || 'bg-yellow-100';
      note.createdAt = new Date();
      note.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Reset 24h timer
    } else {
      // Create new note
      note = new PrivacyNote({
        noteId: 'privacy_notepad',
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
    console.error('Error saving privacy note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/privacy-note
// @desc    Delete privacy note
// @access  Protected by privacy code
router.delete('/', verifyPrivacyCode, async (req, res) => {
  try {
    await PrivacyNote.findOneAndDelete({ noteId: 'privacy_notepad' });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting privacy note:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
