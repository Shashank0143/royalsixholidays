import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search, Filter, MapPin, Clock, Users, Star } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import DestinationGrid from '@/components/destinations/DestinationGrid';

const DestinationsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Destinations', count: 500 },
    { id: 'adventure', name: 'Adventure', count: 125 },
    { id: 'cultural', name: 'Cultural', count: 98 },
    { id: 'beach', name: 'Beach', count: 87 },
    { id: 'mountain', name: 'Mountain', count: 156 },
    { id: 'spiritual', name: 'Spiritual', count: 78 }
  ];

  // Sample featured destinations
  const featuredDestinations = [
    {
      id: 1,
      name: 'Kashmir Great Lakes',
      state: 'jammu-kashmir',
      destination: 'kashmir-great-lakes',
      region: 'Jammu & Kashmir',
      description: 'Trek through pristine alpine lakes surrounded by snow-capped peaks and meadows.',
      location: 'Sonamarg - Kashmir',
      price: 45000,
      rating: 4.9,
      duration: '7-8 days',
      image: '/assets/Destination/Kashmir Great lakes.jpg',
      alt: 'Kashmir Great Lakes - Alpine trekking adventure in pristine mountain wilderness',
      category: 'adventure',
      difficulty: 'Hard',
      bestTime: 'July-September'
    },
    {
      id: 2,
      name: 'Mysore Palace Heritage',
      state: 'karnataka',
      destination: 'mysore',
      region: 'Karnataka',
      description: 'Explore the magnificent Mysore Palace and royal heritage of the Wodeyar dynasty.',
      location: 'Mysore - Karnataka',
      price: 12000,
      rating: 4.7,
      duration: '2-3 days',
      image: '/assets/Destination/MysorePalaceHeritage.jpg',
      alt: 'Mysore Palace Heritage - Royal Wodeyar dynasty palace and cultural experience',
      category: 'cultural',
      difficulty: 'Easy',
      bestTime: 'October-March'
    },
    {
      id: 3,
      name: 'Andaman Coral Islands',
      state: 'andaman-nicobar',
      destination: 'havelock',
      region: 'Andaman & Nicobar',
      description: 'Dive into crystal-clear waters and explore vibrant coral reefs.',
      location: 'Havelock - Andaman',
      price: 35000,
      rating: 4.8,
      duration: '5-6 days',
      image: '/assets/Destination/AndamanCoralIslands.jpg',
      alt: 'Andaman Coral Islands - Pristine beaches and vibrant underwater coral reefs',
      category: 'beach',
      difficulty: 'Medium',
      bestTime: 'November-April'
    },
    {
      id: 4,
      name: 'Rishikesh Yoga Retreat',
      state: 'uttarakhand',
      destination: 'rishikesh',
      region: 'Uttarakhand',
      description: 'Find inner peace with yoga sessions by the holy Ganges river.',
      location: 'Rishikesh - Uttarakhand',
      price: 18000,
      rating: 4.6,
      duration: '4-5 days',
      image: '/assets/Destination/RishikeshYogaRetreat.jpg',
      alt: 'Rishikesh Yoga Retreat - Spiritual wellness by the sacred Ganges river',
      category: 'spiritual',
      difficulty: 'Easy',
      bestTime: 'September-April'
    },
    {
      id: 5,
      name: 'Spiti Valley Expedition',
      state: 'himachal-pradesh',
      destination: 'spiti-valley',
      region: 'Himachal Pradesh',
      description: 'Journey through the cold desert and ancient monasteries of Spiti.',
      location: 'Kaza - Spiti Valley',
      price: 42000,
      rating: 4.9,
      duration: '8-9 days',
      image: '/assets/Destination/SpitiValleyExpedition.jpg',
      alt: 'Spiti Valley Expedition - High-altitude cold desert and ancient Buddhist monasteries',
      category: 'adventure',
      difficulty: 'Hard',
      bestTime: 'May-October'
    },
    {
      id: 6,
      name: 'Hampi Ruins Discovery',
      state: 'karnataka',
      destination: 'hampi',
      region: 'Karnataka',
      description: 'Explore the magnificent ruins of the Vijayanagara Empire.',
      location: 'Hampi - Karnataka',
      price: 15000,
      rating: 4.8,
      duration: '3-4 days',
      image: '/assets/Destination/HampiRuinsDiscovery.jpg',
      alt: 'Hampi Ruins Discovery - Ancient Vijayanagara Empire archaeological site',
      category: 'cultural',
      difficulty: 'Medium',
      bestTime: 'November-February'
    }
  ];

  const filteredDestinations = featuredDestinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDestinationClick = (destination) => {
    console.log('Viewing destination:', destination);
    // Navigate to destination details page
    if (destination.state && destination.destination) {
      router.push(`/explore/${destination.state}/${destination.destination}`);
    } else {
      // Fallback to booking page
      router.push({
        pathname: '/book-trip',
        query: {
          destinationId: destination.id,
          placeName: destination.name,
          destinationName: destination.region
        }
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Discover
                </span>
                <span className="text-gray-800"> India</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From the snow-capped Himalayas to tropical beaches, ancient temples to modern cities - 
                explore the incredible diversity of India.
              </p>
            </motion.div>

            {/* Search and Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl p-6 mb-12"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations, regions, or experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Category Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {filteredDestinations.length} Destinations Found
                </h2>
                <p className="text-gray-600 mt-2">
                  {selectedCategory !== 'all' && `Filtered by ${categories.find(c => c.id === selectedCategory)?.name}`}
                  {searchTerm && ` • Searching for "${searchTerm}"`}
                </p>
              </div>
            </motion.div>

            {/* Destinations Grid */}
            <DestinationGrid 
              destinations={filteredDestinations}
              onDestinationClick={handleDestinationClick}
            />


          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DestinationsPage;