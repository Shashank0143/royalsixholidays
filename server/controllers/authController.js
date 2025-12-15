const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register with email and password
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      phone: phone || '',
      password: hashedPassword,
      authProvider: 'local'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isSubscribed: user.isSubscribed,
        role: user.role,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login with email and password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user registered with Google
    if (user.authProvider === 'google') {
      return res.status(400).json({ 
        message: 'Please sign in with Google',
        requireGoogle: true 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isSubscribed: user.isSubscribed,
        subscriptionExpiry: user.subscriptionExpiry,
        subscriptionType: user.subscriptionType,
        role: user.role,
        authProvider: user.authProvider,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Google OAuth login
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (user) {
      // Update existing user
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        user.profileImage = picture;
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name,
        email,
        googleId,
        authProvider: 'google',
        profileImage: picture
      });
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSubscribed: user.isSubscribed,
        subscriptionExpiry: user.subscriptionExpiry,
        subscriptionType: user.subscriptionType,
        role: user.role,
        authProvider: user.authProvider,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSubscribed: user.isSubscribed,
        subscriptionExpiry: user.subscriptionExpiry,
        subscriptionType: user.subscriptionType,
        role: user.role,
        authProvider: user.authProvider,
        profileImage: user.profileImage,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, profileImage } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSubscribed: user.isSubscribed,
        subscriptionExpiry: user.subscriptionExpiry,
        subscriptionType: user.subscriptionType,
        role: user.role,
        authProvider: user.authProvider,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = {
  register,
  login,
  googleLogin,
  getProfile,
  updateProfile
};