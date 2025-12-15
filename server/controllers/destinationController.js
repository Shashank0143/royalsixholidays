const Destination = require('../models/Destination');
const Place = require('../models/Place');

// Get all destinations
const getAllDestinations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, region, featured } = req.query;
    
    let query = { isActive: true };
    
    // Add search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add region filter
    if (region) {
      query.region = region;
    }
    
    // Add featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    const destinations = await Destination.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Destination.countDocuments(query);

    res.json({
      destinations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalDestinations: total
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ message: 'Server error fetching destinations' });
  }
};

// Get single destination by ID
const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const destination = await Destination.findOne({ 
      _id: id, 
      isActive: true 
    }).lean();
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Get places for this destination
    const places = await Place.find({ 
      destinationId: id, 
      isActive: true 
    })
    .select('name description images averageRating reviewCount cost featured')
    .sort({ featured: -1, averageRating: -1 })
    .lean();

    res.json({
      destination,
      places
    });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({ message: 'Server error fetching destination' });
  }
};

// Get regions for filtering
const getRegions = async (req, res) => {
  try {
    const regions = await Destination.distinct('region', { isActive: true });
    res.json({ regions });
  } catch (error) {
    console.error('Get regions error:', error);
    res.status(500).json({ message: 'Server error fetching regions' });
  }
};

// Create destination (Admin only)
const createDestination = async (req, res) => {
  try {
    const destinationData = req.body;
    
    const destination = new Destination(destinationData);
    await destination.save();

    res.status(201).json({
      message: 'Destination created successfully',
      destination
    });
  } catch (error) {
    console.error('Create destination error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Destination already exists' });
    }
    
    res.status(500).json({ message: 'Server error creating destination' });
  }
};

// Update destination (Admin only)
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const destination = await Destination.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({
      message: 'Destination updated successfully',
      destination
    });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ message: 'Server error updating destination' });
  }
};

// Delete destination (Admin only)
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Also deactivate associated places
    await Place.updateMany(
      { destinationId: id },
      { isActive: false }
    );

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ message: 'Server error deleting destination' });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  getRegions,
  createDestination,
  updateDestination,
  deleteDestination
};