import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IndiaMapComplete = ({ onStateClick, onDestinationClick }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [animatingCars, setAnimatingCars] = useState([]);

  // Complete data for all 29 Indian states
  const indianStates = [
    {
      id: 'andhra-pradesh',
      name: 'Andhra Pradesh',
      x: 300,
      y: 350,
      color: '#FF6B6B',
      destinations: ['Tirupati (Tirumala Temple)', 'Araku Valley', 'Visakhapatnam (RK Beach)']
    },
    {
      id: 'arunachal-pradesh',
      name: 'Arunachal Pradesh',
      x: 420,
      y: 140,
      color: '#4ECDC4',
      destinations: ['Tawang Monastery', 'Ziro Valley', 'Bomdila']
    },
    {
      id: 'assam',
      name: 'Assam',
      x: 400,
      y: 160,
      color: '#45B7D1',
      destinations: ['Kaziranga National Park', 'Majuli Island', 'Kamakhya Temple']
    },
    {
      id: 'bihar',
      name: 'Bihar',
      x: 320,
      y: 180,
      color: '#96CEB4',
      destinations: ['Bodh Gaya', 'Nalanda', 'Rajgir']
    },
    {
      id: 'chhattisgarh',
      name: 'Chhattisgarh',
      x: 280,
      y: 220,
      color: '#FFEAA7',
      destinations: ['Chitrakote Waterfalls', 'Bastar', 'Barnawapara Wildlife Sanctuary']
    },
    {
      id: 'goa',
      name: 'Goa',
      x: 200,
      y: 300,
      color: '#DDA0DD',
      destinations: ['Baga Beach', 'Calangute Beach', 'Basilica of Bom Jesus']
    },
    {
      id: 'gujarat',
      name: 'Gujarat',
      x: 160,
      y: 200,
      color: '#98D8C8',
      destinations: ['Statue of Unity', 'Rann of Kutch', 'Gir National Park']
    },
    {
      id: 'haryana',
      name: 'Haryana',
      x: 230,
      y: 140,
      color: '#F7DC6F',
      destinations: ['Kurukshetra', 'Sultanpur Bird Sanctuary', 'Morni Hills']
    },
    {
      id: 'himachal-pradesh',
      name: 'Himachal Pradesh',
      x: 220,
      y: 110,
      color: '#FFB6C1',
      destinations: ['Shimla', 'Manali', 'Dharamshala']
    },
    {
      id: 'jharkhand',
      name: 'Jharkhand',
      x: 320,
      y: 200,
      color: '#87CEEB',
      destinations: ['Betla National Park', 'Netarhat', 'Baidyanath Dham']
    },
    {
      id: 'karnataka',
      name: 'Karnataka',
      x: 230,
      y: 320,
      color: '#DEB887',
      destinations: ['Mysuru Palace', 'Hampi', 'Coorg']
    },
    {
      id: 'kerala',
      name: 'Kerala',
      x: 220,
      y: 380,
      color: '#90EE90',
      destinations: ['Munnar', 'Alleppey (Backwaters)', 'Wayanad']
    },
    {
      id: 'madhya-pradesh',
      name: 'Madhya Pradesh',
      x: 240,
      y: 200,
      color: '#F0E68C',
      destinations: ['Khajuraho', 'Bandhavgarh National Park', 'Pachmarhi']
    },
    {
      id: 'maharashtra',
      name: 'Maharashtra',
      x: 200,
      y: 240,
      color: '#DA70D6',
      destinations: ['Mumbai', 'Ajanta & Ellora Caves', 'Lonavala']
    },
    {
      id: 'manipur',
      name: 'Manipur',
      x: 410,
      y: 180,
      color: '#FF7F50',
      destinations: ['Loktak Lake', 'Imphal', 'Keibul Lamjao National Park']
    },
    {
      id: 'meghalaya',
      name: 'Meghalaya',
      x: 390,
      y: 170,
      color: '#6495ED',
      destinations: ['Shillong', 'Cherrapunji', 'Living Root Bridges']
    },
    {
      id: 'mizoram',
      name: 'Mizoram',
      x: 420,
      y: 200,
      color: '#40E0D0',
      destinations: ['Aizawl', 'Reiek', 'Vantawng Falls']
    },
    {
      id: 'nagaland',
      name: 'Nagaland',
      x: 410,
      y: 160,
      color: '#EE82EE',
      destinations: ['Kohima', 'Dzukou Valley', 'Mokokchung']
    },
    {
      id: 'odisha',
      name: 'Odisha',
      x: 320,
      y: 240,
      color: '#FFA07A',
      destinations: ['Puri', 'Konark Sun Temple', 'Chilika Lake']
    },
    {
      id: 'punjab',
      name: 'Punjab',
      x: 210,
      y: 120,
      color: '#20B2AA',
      destinations: ['Golden Temple (Amritsar)', 'Wagah Border', 'Jallianwala Bagh']
    },
    {
      id: 'rajasthan',
      name: 'Rajasthan',
      x: 180,
      y: 160,
      color: '#FF4500',
      destinations: ['Jaipur', 'Udaipur', 'Jaisalmer']
    },
    {
      id: 'sikkim',
      name: 'Sikkim',
      x: 360,
      y: 140,
      color: '#32CD32',
      destinations: ['Gangtok', 'Tsomgo Lake', 'Nathula Pass']
    },
    {
      id: 'tamil-nadu',
      name: 'Tamil Nadu',
      x: 250,
      y: 380,
      color: '#FFD700',
      destinations: ['Ooty', 'Kodaikanal', 'Meenakshi Temple (Madurai)']
    },
    {
      id: 'telangana',
      name: 'Telangana',
      x: 260,
      y: 300,
      color: '#FF1493',
      destinations: ['Charminar', 'Golconda Fort', 'Ramoji Film City']
    },
    {
      id: 'tripura',
      name: 'Tripura',
      x: 400,
      y: 190,
      color: '#00CED1',
      destinations: ['Ujjayanta Palace', 'Neermahal', 'Unakoti']
    },
    {
      id: 'uttar-pradesh',
      name: 'Uttar Pradesh',
      x: 260,
      y: 160,
      color: '#9370DB',
      destinations: ['Taj Mahal (Agra)', 'Varanasi', 'Ayodhya']
    },
    {
      id: 'uttarakhand',
      name: 'Uttarakhand',
      x: 240,
      y: 130,
      color: '#3CB371',
      destinations: ['Rishikesh', 'Mussoorie', 'Nainital']
    },
    {
      id: 'west-bengal',
      name: 'West Bengal',
      x: 350,
      y: 200,
      color: '#DC143C',
      destinations: ['Darjeeling', 'Sundarbans', 'Victoria Memorial']
    },
    {
      id: 'jammu-kashmir',
      name: 'Jammu & Kashmir',
      x: 200,
      y: 80,
      color: '#FF69B4',
      destinations: ['Srinagar', 'Leh-Ladakh', 'Gulmarg']
    }
  ];
  
  const startCarAnimation = (fromState, toState) => {
    const carId = `${fromState.id}-${toState.id}-${Date.now()}`;
    const newCar = {
      id: carId,
      from: fromState,
      to: toState,
      startTime: Date.now()
    };
    
    setAnimatingCars(prev => [...prev, newCar]);
    
    setTimeout(() => {
      setAnimatingCars(prev => prev.filter(car => car.id !== carId));
    }, 4000);
  };
  // Auto-generate car animations between states
  useEffect(() => {
    const interval = setInterval(() => {
      if (indianStates.length >= 2) {
        const fromIndex = Math.floor(Math.random() * indianStates.length);
        let toIndex = Math.floor(Math.random() * indianStates.length);
        while (toIndex === fromIndex) {
          toIndex = Math.floor(Math.random() * indianStates.length);
        }
        startCarAnimation(indianStates[fromIndex], indianStates[toIndex]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  const handleStateClick = (state) => {
    setSelectedState(state);
    if (onStateClick) {
      onStateClick(state);
    }
  };

  const handleDestinationClick = (destination, state) => {
    if (onDestinationClick) {
      onDestinationClick(destination, state);
    }
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 rounded-3xl p-8 shadow-2xl"
      >
        {/* Map Title */}
        <div>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-orange-600">🇮🇳</span>
            <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              {" "}Incredible India{" "}
            </span>
            <span className="text-green-600">🇮🇳</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Explore all 29 states • Click any state to discover destinations
          </p>
          </motion.div>
        </div>

        {/* SVG Map Container */}
        <div className="relative bg-white rounded-2xl p-8 shadow-inner">
          <svg
            viewBox="0 0 500 450"
            className="w-full h-96 md:h-[600px]"
            style={{ maxWidth: '100%', height: 'auto' }}
          >
            {/* India Map Outline */}
            <path
              d="M120 100 Q140 80 200 90 Q280 85 350 100 Q420 120 440 180 Q450 240 430 300 Q410 360 380 390 Q340 420 280 440 Q220 450 180 430 Q140 400 120 360 Q100 300 110 240 Q115 180 120 100 Z"
              fill="#f8fafc"
              stroke="#e2e8f0"
              strokeWidth="2"
              className="drop-shadow-lg"
            />

            {/* State Points */}
            {indianStates.map((state, index) => (
              <motion.g
                key={state.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 + 1 }}
              >
                {/* State Circle */}
                <motion.circle
                  cx={state.x}
                  cy={state.y}
                  r={hoveredState === state.id ? 12 : 8}
                  fill={state.color}
                  className="cursor-pointer drop-shadow-lg"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  onMouseEnter={() => setHoveredState(state.id)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => handleStateClick(state)}
                />
                
                {/* State Pulse Animation */}
                <motion.circle
                  cx={state.x}
                  cy={state.y}
                  r={8}
                  fill={state.color}
                  opacity={0.3}
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 0.1, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.1
                  }}
                />

                {/* State Label */}
                <text
                  x={state.x}
                  y={state.y - 15}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-gray-700 pointer-events-none"
                >
                  {state.name.length > 12 ? state.name.split(' ')[0] : state.name}
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
                    stroke="#ff6b35"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
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
                      duration: 4,
                      ease: "easeInOut"
                    }}
                  >
                    <text
                      x={0}
                      y={3}
                      textAnchor="middle"
                      className="text-lg"
                    >
                      🚗
                    </text>
                  </motion.g>
                </motion.g>
              ))}
            </AnimatePresence>
          </svg>

          {/* State Info Panel */}
          <AnimatePresence>
            {hoveredState && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-6 left-6 bg-white p-6 rounded-xl shadow-2xl border max-w-sm"
              >
                {(() => {
                  const state = indianStates.find(s => s.id === hoveredState);
                  return state ? (
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-3">{state.name}</h3>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 text-sm">Popular Destinations:</h4>
                        {state.destinations.map((dest, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ x: 5, scale: 1.02 }}
                            onClick={() => handleDestinationClick(dest, state)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <span className="text-orange-500 text-sm">📍</span>
                            <span className="text-gray-600 text-sm">{dest}</span>
                          </motion.div>
                        ))}
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
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600">{indianStates.length}</div>
            <div className="text-sm text-gray-700">States & UTs</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600">{indianStates.reduce((acc, state) => acc + state.destinations.length, 0)}</div>
            <div className="text-sm text-gray-700">Destinations</div>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600">{animatingCars.length}</div>
            <div className="text-sm text-gray-700">Active Routes</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-700">Support</div>
          </div>
        </motion.div>

        {/* Quick State Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-8"
        >
          <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Quick Access</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {indianStates.slice(0, 8).map((state, index) => (
              <motion.button
                key={state.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStateClick(state)}
                className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg text-sm font-medium text-gray-700 border transition-all duration-200"
                style={{ borderColor: state.color }}
              >
                {state.name.split(' ')[0]}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IndiaMapComplete;