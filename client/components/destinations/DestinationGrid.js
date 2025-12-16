import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Star, MapPin } from 'lucide-react';

const DestinationCard = ({ destination, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
      onClick={() => onClick && onClick(destination)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {destination.image ? (
          <>
            <Image
              src={destination.image}
              alt={destination.alt || destination.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 group-hover:from-black/30 group-hover:to-black/10 transition-all duration-500" />
          </>
        ) : (
          <>
            <motion.div
              className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Fallback emoji for destinations without images */}
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl">
                  {destination.emoji || '🏛️'}
                </span>
              </div>
            </motion.div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
          </>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold">{destination.rating || '4.8'}</span>
        </div>

        {/* Region Badge */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          {destination.region}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {destination.name}
          </h3>
          <motion.div
            whileHover={{ x: 5 }}
            className="text-blue-600"
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {destination.description}
        </p>

        {/* Location & Duration */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{destination.location}</span>
          </div>
          <span>{destination.duration || '3-5 days'}</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-800">
              ₹{destination.price?.toLocaleString() || '15,000'}
            </span>
            <span className="text-gray-500 text-sm ml-1">per person</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(destination);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Explore
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const DestinationGrid = ({ destinations = [], onDestinationClick }) => {
  // Sample destinations if none provided
  const sampleDestinations = [
    {
      id: 1,
      name: 'Golden Triangle',
      region: 'North India',
      description: 'Experience the magnificent trio of Delhi, Agra, and Jaipur with their rich history and culture.',
      location: 'Delhi - Agra - Jaipur',
      price: 18500,
      rating: 4.9,
      duration: '6-7 days',
      emoji: '🕌'
    },
    {
      id: 2,
      name: 'Kerala Backwaters',
      region: 'South India',
      description: 'Cruise through serene backwaters, lush greenery, and traditional houseboats.',
      location: 'Alleppey - Kumarakom',
      price: 22000,
      rating: 4.8,
      duration: '4-5 days',
      emoji: '🚤'
    },
    {
      id: 3,
      name: 'Goa Beaches',
      region: 'West India',
      description: 'Relax on pristine beaches, enjoy water sports, and experience vibrant nightlife.',
      location: 'North & South Goa',
      price: 15000,
      rating: 4.7,
      duration: '3-4 days',
      emoji: '🏖️'
    },
    {
      id: 4,
      name: 'Himalayan Adventure',
      region: 'North India',
      description: 'Trek through scenic mountain trails and experience spiritual awakening.',
      location: 'Manali - Leh - Ladakh',
      price: 35000,
      rating: 4.9,
      duration: '8-10 days',
      emoji: '🏔️'
    },
    {
      id: 5,
      name: 'Rajasthan Royal',
      region: 'West India',
      description: 'Explore majestic palaces, desert safaris, and royal heritage.',
      location: 'Udaipur - Jodhpur - Jaisalmer',
      price: 28000,
      rating: 4.8,
      duration: '7-8 days',
      emoji: '🏰'
    },
    {
      id: 6,
      name: 'Temple Circuit',
      region: 'South India',
      description: 'Journey through ancient temples and spiritual destinations.',
      location: 'Chennai - Madurai - Rameswaram',
      price: 16500,
      rating: 4.6,
      duration: '5-6 days',
      emoji: '⛩️'
    }
  ];

  const displayDestinations = destinations.length > 0 ? destinations : sampleDestinations;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Section Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Popular Destinations
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover handpicked destinations across India, each offering unique experiences 
          and unforgettable memories.
        </p>
      </motion.div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayDestinations.map((destination, index) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            index={index}
            onClick={onDestinationClick}
          />
        ))}
      </div>


    </motion.div>
  );
};

export default DestinationGrid;