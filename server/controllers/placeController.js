const Place = require('../models/Place');
const Destination = require('../models/Destination');

// Get place by ID (Protected - requires subscription)
const getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const place = await Place.findOne({ 
      _id: id, 
      isActive: true 
    })
    .populate('destinationId', 'name description region')
    .lean();
    
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({ place });
  } catch (error) {
    console.error('Get place error:', error);
    res.status(500).json({ message: 'Server error fetching place' });
  }
};

// Get places by destination ID
const getPlacesByDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const { page = 1, limit = 10, search, featured } = req.query;
    
    let query = { 
      destinationId, 
      isActive: true 
    };
    
    // Add search filter
    if (search) {
      query.$text = { $search: search };
    }
    
    // Add featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    const places = await Place.find(query)
      .select('name description images averageRating reviewCount cost featured coordinates')
      .sort({ featured: -1, averageRating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Place.countDocuments(query);

    res.json({
      places,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalPlaces: total
    });
  } catch (error) {
    console.error('Get places by destination error:', error);
    res.status(500).json({ message: 'Server error fetching places' });
  }
};

// Search places
const searchPlaces = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const query = {
      $text: { $search: q },
      isActive: true
    };

    const places = await Place.find(query)
      .populate('destinationId', 'name region')
      .select('name description images averageRating reviewCount destinationId')
      .sort({ score: { $meta: 'textScore' }, averageRating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Place.countDocuments(query);

    res.json({
      places,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalPlaces: total,
      searchQuery: q
    });
  } catch (error) {
    console.error('Search places error:', error);
    res.status(500).json({ message: 'Server error searching places' });
  }
};

// Create place (Admin only)
const createPlace = async (req, res) => {
  try {
    const placeData = req.body;
    
    // Verify destination exists
    const destination = await Destination.findById(placeData.destinationId);
    if (!destination) {
      return res.status(400).json({ message: 'Invalid destination ID' });
    }

    const place = new Place(placeData);
    await place.save();

    res.status(201).json({
      message: 'Place created successfully',
      place
    });
  } catch (error) {
    console.error('Create place error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Place already exists in this destination' });
    }
    
    res.status(500).json({ message: 'Server error creating place' });
  }
};

// Update place (Admin only)
const updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const place = await Place.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({
      message: 'Place updated successfully',
      place
    });
  } catch (error) {
    console.error('Update place error:', error);
    res.status(500).json({ message: 'Server error updating place' });
  }
};

// Delete place (Admin only)
const deletePlace = async (req, res) => {
  try {
    const { id } = req.params;

    const place = await Place.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({ message: 'Server error deleting place' });
  }
};

// Get featured places
const getFeaturedPlaces = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const places = await Place.find({ 
      featured: true, 
      isActive: true 
    })
    .populate('destinationId', 'name region')
    .select('name description images averageRating reviewCount destinationId cost')
    .sort({ averageRating: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json({ places });
  } catch (error) {
    console.error('Get featured places error:', error);
    res.status(500).json({ message: 'Server error fetching featured places' });
  }
};

module.exports = {
  getPlaceById,
  getPlacesByDestination,
  searchPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  getFeaturedPlaces
};