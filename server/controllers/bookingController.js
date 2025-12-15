const Booking = require('../models/Booking');
const User = require('../models/User');
const Place = require('../models/Place');
const Destination = require('../models/Destination');

// Create new booking
const createBooking = async (req, res) => {
  try {
    const {
      destinationId,
      placeId,
      bookingDetails,
      contactInfo,
      totalAmount,
      packageType
    } = req.body;

    // Verify destination and place exist
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(400).json({ message: 'Invalid destination' });
    }

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(400).json({ message: 'Invalid place' });
    }

    // Verify place belongs to destination
    if (place.destinationId.toString() !== destinationId) {
      return res.status(400).json({ message: 'Place does not belong to the selected destination' });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user.id,
      destinationId,
      placeId,
      bookingDetails: {
        ...bookingDetails,
        packageType
      },
      contactInfo,
      totalAmount,
      status: 'pending'
    });

    await booking.save();

    // Populate booking with destination and place details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('destinationId', 'name region')
      .populate('placeId', 'name images')
      .populate('userId', 'name email');

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { userId: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('destinationId', 'name region image')
      .populate('placeId', 'name images averageRating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalBookings: total
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findOne({ 
      _id: id, 
      userId: req.user.id 
    })
    .populate('destinationId', 'name region description image')
    .populate('placeId', 'name description images details cost hotels')
    .lean();

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
};

// Update booking status (User can only cancel)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const booking = await Booking.findOne({ 
      _id: id, 
      userId: req.user.id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Users can only cancel pending bookings
    if (status === 'cancelled' && booking.status === 'pending') {
      booking.status = status;
      if (notes) booking.notes = notes;
      
      await booking.save();

      res.json({
        message: 'Booking cancelled successfully',
        booking
      });
    } else {
      res.status(400).json({ 
        message: 'Invalid status update. You can only cancel pending bookings.' 
      });
    }
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      startDate, 
      endDate,
      destinationId,
      userId
    } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (destinationId) query.destinationId = destinationId;
    if (userId) query.userId = userId;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('destinationId', 'name region')
      .populate('placeId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalBookings: total
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error fetching all bookings' });
  }
};

// Update booking status (Admin only)
const updateBookingStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, paymentStatus } = req.body;
    
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (notes) booking.notes = notes;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate('userId', 'name email')
      .populate('destinationId', 'name region')
      .populate('placeId', 'name');

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking admin error:', error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
};

// Get booking statistics (Admin only)
const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const totalRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Get bookings by month for chart
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.json({
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      monthlyBookings
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ message: 'Server error fetching booking statistics' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
  updateBookingStatusAdmin,
  getBookingStats
};