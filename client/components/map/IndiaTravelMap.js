import { useState } from "react";
import { motion } from "framer-motion";

// Simplified coordinates for demo purposes (SVG viewBox based)
const destinations = [
  { name: "Delhi", x: 320, y: 180 },
  { name: "Jaipur", x: 290, y: 220 },
  { name: "Mumbai", x: 250, y: 300 },
  { name: "Goa", x: 240, y: 340 },
  { name: "Bengaluru", x: 300, y: 380 },
  { name: "Chennai", x: 340, y: 380 },
  { name: "Kolkata", x: 420, y: 260 },
  { name: "Agra", x: 330, y: 210 }
];

export default function IndiaTravelMap() {
  const [carPos, setCarPos] = useState({ x: 300, y: 260 });
  const [active, setActive] = useState(null);

  const handleMove = (place) => {
    setActive(place.name);
    setCarPos({ x: place.x, y: place.y });
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <h1 className="text-xl font-semibold text-center mb-2">India Travel Map</h1>

        <svg
          viewBox="0 0 600 500"
          className="w-[700px] max-w-full"
        >
          {/* Placeholder India Map */}
          <image
            href="/in.svg" // replace with your SVG map path
            x="0"
            y="0"
            width="600"
            height="500"
          />

          {/* Destinations */}
          {destinations.map((place) => (
            <g key={place.name} onClick={() => handleMove(place)}>
              <circle
                cx={place.x}
                cy={place.y}
                r={6}
                className="fill-red-600 cursor-pointer"
              />
              <text
                x={place.x + 8}
                y={place.y + 4}
                fontSize="10"
                className="fill-gray-700"
              >
                {place.name}
              </text>
            </g>
          ))}

          {/* Car Animation */}
          <motion.g
            animate={{ x: carPos.x - 300, y: carPos.y - 260 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <image
              href="/car.png" // small car icon
              x="290"
              y="250"
              width="30"
              height="30"
            />
          </motion.g>
        </svg>

        {active && (
          <p className="text-center mt-2 text-sm text-gray-600">
            Travelling to <span className="font-semibold">{active}</span>
          </p>
        )}
      </div>
    </div>
  );
}
