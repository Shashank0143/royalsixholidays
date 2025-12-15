import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IndiaMap = ({ onRegionClick, selectedDestinations = [] }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [animatingCars, setAnimatingCars] = useState([]);

  // Indian states/regions with their coordinates and popular destinations
  const regions = [
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      x: 180,
      y: 200,
      color: '#FF6B6B',
      destinations: ['Jaipur', 'Udaipur', 'Jodhpur'],
      description: 'Land of Kings'
    },
    {
      id: 'kerala',
      name: 'Kerala',
      x: 160,
      y: 420,
      color: '#4ECDC4',
      destinations: ['Kochi', 'Munnar', 'Alleppey'],
      description: 'Gods Own Country'
    },
    {
      id: 'goa',
      name: 'Goa',
      x: 140,
      y: 350,
      color: '#45B7D1',
      destinations: ['Panaji', 'Calangute', 'Baga'],
      description: 'Beach Paradise'
    },
    {
      id: 'himachal',
      name: 'Himachal Pradesh',
      x: 200,
      y: 120,
      color: '#96CEB4',
      destinations: ['Shimla', 'Manali', 'Dharamshala'],
      description: 'Mountain Haven'
    },
    {
      id: 'uttarakhand',
      name: 'Uttarakhand',
      x: 220,
      y: 140,
      color: '#FFEAA7',
      destinations: ['Nainital', 'Rishikesh', 'Mussoorie'],
      description: 'Spiritual Retreat'
    },
    {
      id: 'maharashtra',
      name: 'Maharashtra',
      x: 170,
      y: 280,
      color: '#DDA0DD',
      destinations: ['Mumbai', 'Pune', 'Aurangabad'],
      description: 'Commercial Capital'
    },
    {
      id: 'karnataka',
      name: 'Karnataka',
      x: 160,
      y: 350,
      color: '#98D8C8',
      destinations: ['Bangalore', 'Mysore', 'Hampi'],
      description: 'Silicon Valley of India'
    },
    {
      id: 'tamilnadu',
      name: 'Tamil Nadu',
      x: 180,
      y: 420,
      color: '#F7DC6F',
      destinations: ['Chennai', 'Ooty', 'Madurai'],
      description: 'Temple Land'
    }
  ];

  // Car animation between regions
  const startCarAnimation = (fromRegion, toRegion) => {
    const carId = `${fromRegion.id}-${toRegion.id}-${Date.now()}`;
    const newCar = {
      id: carId,
      from: fromRegion,
      to: toRegion,
      startTime: Date.now()
    };
    
    setAnimatingCars(prev => [...prev, newCar]);
    
    // Remove car after animation completes
    setTimeout(() => {
      setAnimatingCars(prev => prev.filter(car => car.id !== carId));
    }, 3000);
  };

  // Auto-generate random car animations
  useEffect(() => {
    const interval = setInterval(() => {
      if (regions.length >= 2) {
        const fromIndex = Math.floor(Math.random() * regions.length);
        let toIndex = Math.floor(Math.random() * regions.length);
        while (toIndex === fromIndex) {
          toIndex = Math.floor(Math.random() * regions.length);
        }
        startCarAnimation(regions[fromIndex], regions[toIndex]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleRegionClick = (region) => {
    if (onRegionClick) {
      onRegionClick(region);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 shadow-2xl"
      >
        {/* Map Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-center mb-8 text-gray-800"
        >
          Discover Incredible India 🇮🇳
        </motion.h2>

        {/* SVG Map Container */}
        <div className="relative bg-white rounded-2xl p-6 shadow-inner">
          <svg
            viewBox="0 0 400 500"
            className="w-full h-96 md:h-[500px]"
            style={{ maxWidth: '100%', height: 'auto' }}
          >
            {/* India Map Outline (Simplified) */}
            <path
              d="M100 150 Q120 100 180 120 Q250 110 280 130 Q320 150 330 200 Q340 250 320 300 Q300 350 280 380 Q250 420 200 450 Q150 460 120 440 Q90 400 80 350 Q70 300 80 250 Q90 200 100 150 Z"
              fill="#f8fafc"
              stroke="#e2e8f0"
              strokeWidth="2"
              className="drop-shadow-lg"
            />

            {/* Region Points */}
            {regions.map((region, index) => (
              <motion.g
                key={region.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 + 1 }}
              >
                {/* Region Circle */}
                <motion.circle
                  cx={region.x}
                  cy={region.y}
                  r={hoveredRegion === region.id ? 20 : 15}
                  fill={region.color}
                  className="cursor-pointer drop-shadow-lg"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => handleRegionClick(region)}
                />
                
                {/* Region Pulse Animation */}
                <motion.circle
                  cx={region.x}
                  cy={region.y}
                  r={15}
                  fill={region.color}
                  opacity={0.3}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.1, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />

                {/* Region Label */}
                <text
                  x={region.x}
                  y={region.y - 25}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-gray-700 pointer-events-none"
                >
                  {region.name}
                </text>
              </motion.g>
            ))}

            {/* Animated Cars */}
            <AnimatePresence>
              {animatingCars.map((car) => (
                <motion.g key={car.id}>
                  {/* Car Path */}
                  <motion.line
                    x1={car.from.x}
                    y1={car.from.y}
                    x2={car.to.x}
                    y2={car.to.y}
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  />
                  
                  {/* Moving Car */}
                  <motion.g
                    initial={{
                      x: car.from.x,
                      y: car.from.y
                    }}
                    animate={{
                      x: car.to.x,
                      y: car.to.y
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Car Body */}
                    <rect
                      x={-8}
                      y={-4}
                      width={16}
                      height={8}
                      rx={2}
                      fill="#3b82f6"
                      className="drop-shadow"
                    />
                    {/* Car Windows */}
                    <rect
                      x={-6}
                      y={-2}
                      width={12}
                      height={4}
                      rx={1}
                      fill="#93c5fd"
                    />
                    {/* Car Emoji Alternative */}
                    <text
                      x={0}
                      y={3}
                      textAnchor="middle"
                      className="text-xs"
                    >
                      🚗
                    </text>
                  </motion.g>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>

          {/* Region Info Panel */}
          <AnimatePresence>
            {hoveredRegion && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border"
              >
                {(() => {
                  const region = regions.find(r => r.id === hoveredRegion);
                  return region ? (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{region.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{region.description}</p>
                      <div className="text-xs text-gray-500">
                        <strong>Popular:</strong> {region.destinations.join(', ')}
                      </div>
                    </div>
                  ) : null;
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-6 grid grid-cols-3 gap-4 text-center"
        >
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{regions.length}</div>
            <div className="text-sm text-gray-600">Destinations</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{animatingCars.length}</div>
            <div className="text-sm text-gray-600">Active Routes</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IndiaMap;