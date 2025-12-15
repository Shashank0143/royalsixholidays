import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IndiaMapEnhanced = ({ onStateClick, onDestinationClick }) => {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('INDL'); // Default to Delhi
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationFrom, setAnimationFrom] = useState('INDL'); // Track where animation starts
  const [animationTo, setAnimationTo] = useState(null); // Track where animation ends
  const svgContainerRef = useRef(null);

  // State coordinates for animation (approximate center of each state on the SVG)
  const stateCoordinates = {
    INAN: { x: 800, y: 920 },
    INTG: { x: 400, y: 620 },
    INAP: { x: 430, y: 700 },
    INAR: { x: 780, y: 320 },
    INAS: { x: 720, y: 400 },
    INBR: { x: 580, y: 400 },
    INCH: { x: 335, y: 255 },
    INCT: { x: 480, y: 530 },
    INDH: { x: 235, y: 575 },
    INDL: { x: 350, y: 320 },
    INGA: { x: 265, y: 715 },
    INGJ: { x: 220, y: 500 },
    INHR: { x: 340, y: 290 },
    INHP: { x: 360, y: 220 },
    INJH: { x: 565, y: 475 },
    INKA: { x: 320, y: 750 },
    INKL: { x: 330, y: 850 },
    INMP: { x: 400, y: 480 },
    INMH: { x: 310, y: 600 },
    INMN: { x: 800, y: 440 },
    INML: { x: 740, y: 420 },
    INMZ: { x: 780, y: 480 },
    INNL: { x: 820, y: 400 },
    INOR: { x: 550, y: 560 },
    INPY: { x: 420, y: 840 },
    INPB: { x: 320, y: 260 },
    INRJ: { x: 280, y: 400 },
    INSK: { x: 655, y: 360 },
    INTN: { x: 380, y: 830 },
    INTR: { x: 745, y: 475 },
    INUP: { x: 450, y: 380 },
    INUT: { x: 400, y: 270 },
    INWB: { x: 640, y: 490 },
    INLD: { x: 235, y: 915 },
    INJK: { x: 300, y: 160 },
    INLA: { x: 360, y: 140 },
    INDD: { x: 230, y: 590 }
  };

  // Complete state data for all states and union territories
  const stateData = {
    INAN: { name: 'Andaman and Nicobar', destinations: ['Port Blair', 'Havelock Island', 'Neil Island'] },
    INTG: { name: 'Telangana', destinations: ['Hyderabad', 'Warangal', 'Khammam'] },
    INAP: { name: 'Andhra Pradesh', destinations: ['Visakhapatnam', 'Vijayawada', 'Tirupati'] },
    INAR: { name: 'Arunachal Pradesh', destinations: ['Itanagar', 'Tawang', 'Ziro'] },
    INAS: { name: 'Assam', destinations: ['Guwahati', 'Jorhat', 'Silchar'] },
    INBR: { name: 'Bihar', destinations: ['Patna', 'Gaya', 'Rajgir'] },
    INCH: { name: 'Chandigarh', destinations: ['Chandigarh'] },
    INCT: { name: 'Chhattisgarh', destinations: ['Raipur', 'Bilaspur', 'Jagdalpur'] },
    INDH: { name: 'Dadra and Nagar Haveli', destinations: ['Silvassa'] },
    INDL: { name: 'Delhi', destinations: ['New Delhi', 'Old Delhi', 'Connaught Place'] },
    INGA: { name: 'Goa', destinations: ['Panaji', 'Margao', 'Calangute'] },
    INGJ: { name: 'Gujarat', destinations: ['Ahmedabad', 'Surat', 'Vadodara'] },
    INHR: { name: 'Haryana', destinations: ['Gurugram', 'Faridabad', 'Panipat'] },
    INHP: { name: 'Himachal Pradesh', destinations: ['Shimla', 'Manali', 'Dharamshala'] },
    INJH: { name: 'Jharkhand', destinations: ['Ranchi', 'Jamshedpur', 'Dhanbad'] },
    INKA: { name: 'Karnataka', destinations: ['Bangalore', 'Mysore', 'Hampi'] },
    INKL: { name: 'Kerala', destinations: ['Kochi', 'Thiruvananthapuram', 'Munnar'] },
    INMP: { name: 'Madhya Pradesh', destinations: ['Bhopal', 'Indore', 'Ujjain'] },
    INMH: { name: 'Maharashtra', destinations: ['Mumbai', 'Pune', 'Nashik'] },
    INMN: { name: 'Manipur', destinations: ['Imphal', 'Churachandpur'] },
    INML: { name: 'Meghalaya', destinations: ['Shillong', 'Cherrapunji'] },
    INMZ: { name: 'Mizoram', destinations: ['Aizawl', 'Lunglei'] },
    INNL: { name: 'Nagaland', destinations: ['Kohima', 'Dimapur'] },
    INOR: { name: 'Orissa', destinations: ['Bhubaneswar', 'Puri', 'Konark'] },
    INPY: { name: 'Puducherry', destinations: ['Puducherry', 'Karaikal'] },
    INPB: { name: 'Punjab', destinations: ['Chandigarh', 'Ludhiana', 'Amritsar'] },
    INRJ: { name: 'Rajasthan', destinations: ['Jaipur', 'Udaipur', 'Jodhpur'] },
    INSK: { name: 'Sikkim', destinations: ['Gangtok', 'Pelling'] },
    INTN: { name: 'Tamil Nadu', destinations: ['Chennai', 'Madurai', 'Coimbatore'] },
    INTR: { name: 'Tripura', destinations: ['Agartala', 'Udaipur'] },
    INUP: { name: 'Uttar Pradesh', destinations: ['Lucknow', 'Varanasi', 'Agra'] },
    INUT: { name: 'Uttarakhand', destinations: ['Dehradun', 'Haridwar', 'Rishikesh'] },
    INWB: { name: 'West Bengal', destinations: ['Kolkata', 'Darjeeling', 'Sundarbans'] },
    INLD: { name: 'Lakshadweep', destinations: ['Kavaratti', 'Agatti'] },
    INJK: { name: 'Jammu and Kashmir', destinations: ['Srinagar', 'Jammu', 'Gulmarg'] },
    INLA: { name: 'Ladakh', destinations: ['Leh', 'Nubra Valley', 'Pangong Lake'] },
    INDD: { name: 'Daman and Diu', destinations: ['Daman', 'Diu'] }
  };

  // Load and enhance the SVG map from the public folder
  useEffect(() => {
    const loadAndEnhanceSvg = async () => {
      try {
        const response = await fetch('/in.svg');
        const svgText = await response.text();
        
        if (svgContainerRef.current) {
          // Insert the SVG into the container
          svgContainerRef.current.innerHTML = svgText;
          
          // Get the SVG element
          const svgElement = svgContainerRef.current.querySelector('svg');
          if (svgElement) {
            // Style the SVG for responsive display
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            svgElement.style.maxWidth = '800px';
            svgElement.style.maxHeight = '600px';
            
            // Find all path elements and add interactivity markers
            const paths = svgElement.querySelectorAll('path');
            paths.forEach(path => {
              const stateId = path.getAttribute('id');
              
              if (stateId && stateData[stateId]) {
                path.style.cursor = 'pointer';
                path.style.transition = 'fill 0.3s ease, stroke-width 0.2s ease';
                path.setAttribute('data-state-id', stateId);
                
                // Highlight current location state
                if (stateId === currentLocation) {
                  path.style.fill = '#10b981'; // Green for current location
                }
              }
            });
            
            setSvgLoaded(true);
          }
        }
      } catch (error) {
        console.error('Failed to load India map SVG:', error);
      }
    };

    loadAndEnhanceSvg();
  }, [currentLocation]);

  // Handle mouse events on SVG container using event delegation
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container || !svgLoaded) return;

    const handleMouseOver = (e) => {
      const path = e.target.closest('path[data-state-id]');
      if (path) {
        const stateId = path.getAttribute('data-state-id');
        if (stateId && stateData[stateId]) {
          setHoveredState(stateId);
          path.style.fill = '#4f46e5';
          path.style.strokeWidth = '1.5';
        }
      }
    };

    const handleMouseOut = (e) => {
      const path = e.target.closest('path[data-state-id]');
      if (path) {
        const stateId = path.getAttribute('data-state-id');
        if (stateId) {
          setHoveredState(null);
          path.style.fill = selectedState === stateId ? '#3b82f6' : '#6f9c76';
          path.style.strokeWidth = '0.5';
        }
      }
    };

    const handleClick = (e) => {
      const path = e.target.closest('path[data-state-id]');
      if (path) {
        const stateId = path.getAttribute('data-state-id');
        if (stateId && stateData[stateId]) {
          const newState = selectedState === stateId ? null : stateId;
          
          // Trigger car animation from current location to selected state
          if (newState && stateCoordinates[newState] && stateCoordinates[currentLocation] && newState !== currentLocation) {
            // Store animation path before changing state
            setAnimationFrom(currentLocation);
            setAnimationTo(newState);
            setIsAnimating(true);
            
            // After animation completes, update current location
            setTimeout(() => {
              setCurrentLocation(newState);
              setIsAnimating(false);
              setAnimationTo(null);
            }, 2000); // Match animation duration
          }
          
          setSelectedState(newState);
          
          // Update all path colors
          container.querySelectorAll('path[data-state-id]').forEach(p => {
            const pId = p.getAttribute('data-state-id');
            if (pId === stateId && newState) {
              p.style.fill = '#3b82f6';
            } else {
              p.style.fill = '#6f9c76';
            }
          });
          
          if (onStateClick && newState && stateData[newState]) {
            onStateClick(stateData[newState]);
          }
        }
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mouseout', handleMouseOut);
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
      container.removeEventListener('click', handleClick);
    };
  }, [svgLoaded, selectedState, onStateClick]);

  const handleDestinationClick = (destination) => {
    if (onDestinationClick && selectedState && stateData[selectedState]) {
      onDestinationClick(destination, stateData[selectedState]);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Explore India with Royal Six Holidays
        </h2>
        <p className="text-gray-600">Click on any state to discover amazing destinations</p>
      </div>

      <div className="relative flex justify-center items-center min-h-[500px]">
        {/* SVG Map Container - dynamically loaded from public/in.svg */}
        <div 
          ref={svgContainerRef} 
          className="w-full flex justify-center"
          style={{ maxWidth: '800px' }}
        />
        
        {/* Loading state */}
        {!svgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading India Map...</span>
          </div>
        )}

        {/* Hover tooltip */}
        <AnimatePresence>
          {hoveredState && stateData[hoveredState] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200 pointer-events-none z-10"
            >
              <p className="font-semibold text-gray-800">{stateData[hoveredState].name}</p>
              <p className="text-xs text-gray-500">{stateData[hoveredState].destinations.length} destinations</p>
              {hoveredState === currentLocation && (
                <p className="text-xs text-green-600 font-medium mt-1">📍 You are here</p>
              )}
              {hoveredState !== currentLocation && (
                <p className="text-xs text-indigo-600 mt-1">🚗 Click to travel here</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Car - moves from current location to selected state */}
        <AnimatePresence>
          {isAnimating && animationTo && stateCoordinates[animationFrom] && stateCoordinates[animationTo] && (
            <motion.div
              className="absolute text-3xl pointer-events-none z-30"
              initial={{ 
                left: `calc(50% + ${(stateCoordinates[animationFrom].x - 500) * 0.8}px)`,
                top: `calc(50% + ${(stateCoordinates[animationFrom].y - 500) * 0.6}px)`,
                scale: 1
              }}
              animate={{ 
                left: `calc(50% + ${(stateCoordinates[animationTo].x - 500) * 0.8}px)`,
                top: `calc(50% + ${(stateCoordinates[animationTo].y - 500) * 0.6}px)`,
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 2,
                ease: "easeInOut"
              }}
            >
              🚗
            </motion.div>
          )}
        </AnimatePresence>

        {/* Static car at current location when not animating */}
        {!isAnimating && stateCoordinates[currentLocation] && (
          <motion.div
            className="absolute text-2xl pointer-events-none z-20"
            style={{
              left: `calc(50% + ${(stateCoordinates[currentLocation].x - 500) * 0.8}px)`,
              top: `calc(50% + ${(stateCoordinates[currentLocation].y - 500) * 0.6}px)`
            }}
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            📍🚗
          </motion.div>
        )}

        {/* Flight animation - decorative background animation */}
        <motion.div
          className="absolute text-2xl pointer-events-none z-20 opacity-50"
          animate={{
            x: [700, 500, 300, 100, 300, 500],
            y: [80, 120, 160, 200, 160, 100]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        >
          ✈️
        </motion.div>
      </div>

      {/* State Information Panel */}
      <AnimatePresence>
        {selectedState && stateData[selectedState] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {stateData[selectedState].name}
            </h3>
            <p className="text-gray-600 mb-4">Popular Destinations:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stateData[selectedState].destinations.map((destination, index) => (
                <motion.div
                  key={destination}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-center font-medium hover:from-blue-600 hover:to-indigo-700 cursor-pointer transition-all duration-200 transform hover:scale-105"
                  onClick={() => handleDestinationClick(destination)}
                >
                  {destination}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Location Indicator */}
      <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200 z-10">
        <p className="text-xs text-gray-500">Your Location</p>
        <p className="font-semibold text-indigo-600">
          {stateData[currentLocation]?.name || 'Delhi'}
        </p>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>🚗 Car will travel from your current location to selected state</p>
        <p className="mt-1">🖱️ Hover over states to see names • 👆 Click to explore destinations</p>
      </div>

      {/* Legend */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Interactive map showing all Indian states and union territories with 87+ destinations
        </p>
      </div>
    </div>
  );
};

export default IndiaMapEnhanced;
