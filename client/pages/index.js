import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, Play, MapPin, Users, Shield, Star } from 'lucide-react';
import IndiaMapEnhanced from '../components/map/IndiaMapEnhanced';
import Layout from '../components/layout/Layout';

export default function Home() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (state) => {
    setSelectedState(state);
    console.log('Selected state:', state);
  };

  const handleDestinationClick = (destination, state) => {
    console.log('Selected destination:', destination, 'in state:', state);
    // Navigate to destination page
    try {
      const stateName = state?.name || 'india';
      const destinationName = destination || 'explore';
      const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
      const destinationSlug = destinationName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
      router.push(`/explore/${stateSlug}/${destinationSlug}`);
    } catch (error) {
      console.error('Navigation error:', error);
      router.push('/destinations');
    }
  };

  const handlePlanSelect = (plan) => {
    console.log('Selected plan:', plan);
    router.push('/subscription');
  };

  const handleDestinationExplore = (destinationName) => {
    // Navigate to destinations page with search
    try {
      if (destinationName) {
        router.push(`/destinations?search=${encodeURIComponent(destinationName)}`);
      } else {
        router.push('/destinations');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.push('/destinations');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="text-center">
            {/* Main Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Royal Six
                </span>
                <br />
                <span className="text-gray-800">Holidays</span>
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Discover incredible destinations across India with our expertly curated 
                travel experiences and premium hospitality services.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/destinations" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-2xl flex items-center justify-center space-x-2 transition-all duration-300 text-sm sm:text-base"
                  >
                    <span>Start Your Journey</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl border border-gray-200 shadow-xl flex items-center justify-center space-x-2 transition-all duration-300 text-sm sm:text-base"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Watch Story</span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16 px-4"
            >
              {[
                { number: '500+', label: 'Destinations', icon: MapPin },
                { number: '10K+', label: 'Happy Travelers', icon: Users },
                { number: '4.9★', label: 'Rating', icon: Star },
                { number: '24/7', label: 'Support', icon: Shield }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-xl text-center"
                >
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mx-auto mb-2 sm:mb-3 text-blue-600" />
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive India Map - All 29 States */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
              Discover All 29 States of India
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Click any state to explore destinations • Watch animated cars travel between states • 
              Discover 87+ incredible destinations across all 29 states
            </p>
          </motion.div>
          
          

          <IndiaMapEnhanced 
            onStateClick={handleStateClick}
            onDestinationClick={handleDestinationClick}
          />

          {/* Selected State Details */}
          <AnimatePresence>
            {selectedState && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="mt-8 sm:mt-12 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    🎯 Exploring {selectedState.name}
                  </h3>
                  <p className="text-gray-600">
                    Discover the top destinations in {selectedState.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {selectedState.destinations?.map((destination, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.01 }}
                      onClick={() => handleDestinationClick(destination, selectedState)}
                      className="bg-gradient-to-br from-orange-50 to-green-50 p-4 sm:p-6 rounded-xl shadow-lg cursor-pointer group touch-manipulation"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-4">📍</div>
                        <h4 className="font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                          {destination}
                        </h4>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDestinationClick(destination, selectedState);
                          }}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          Explore Now
                        </motion.button>
                      </div>
                    </motion.div>
                  )) || []}
                </div>

                <div className="text-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedState(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium"
                  >
                    Close Details
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Popular Destinations Preview */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 px-2">Popular Destinations</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Discover handpicked destinations across India, each offering unique experiences 
              and unforgettable memories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: 'Taj Mahal (Agra)', region: 'Uttar Pradesh', price: '₹18,500', emoji: '🕌', rating: '4.9' },
              { name: 'Munnar', region: 'Kerala', price: '₹22,000', emoji: '🌿', rating: '4.8' },
              { name: 'Baga Beach', region: 'Goa', price: '₹15,000', emoji: '🏖️', rating: '4.7' },
              { name: 'Manali', region: 'Himachal Pradesh', price: '₹35,000', emoji: '🏔️', rating: '4.9' },
              { name: 'Jaipur', region: 'Rajasthan', price: '₹28,000', emoji: '🏰', rating: '4.8' },
              { name: 'Meenakshi Temple', region: 'Tamil Nadu', price: '₹16,500', emoji: '⛩️', rating: '4.6' }
            ].map((dest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden cursor-pointer group touch-manipulation"
              >
                <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl">{dest.emoji}</span>
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{dest.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {dest.region}
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1">{dest.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{dest.price}</span>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDestinationExplore(dest.name)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg font-medium text-sm touch-manipulation"
                    >
                      Explore
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans Preview */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 px-2">Choose Your Travel Style</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Unlock exclusive destinations and premium travel experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Explorer',
                type: 'Basic',
                price: '₹999',
                features: ['50+ destinations', 'Standard support', 'Basic insurance', 'Mobile app'],
                color: 'from-blue-400 to-purple-500',
                popular: false
              },
              {
                name: 'Royal Traveler', 
                type: 'Premium',
                price: '₹2,999',
                features: ['ALL destinations', 'Priority booking', 'Premium support', '24/7 assistance', 'Luxury stays', 'Personal consultant'],
                color: 'from-yellow-400 to-orange-500',
                popular: true
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden ${
                  plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                      👑 Most Popular
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <span className="text-3xl">{plan.popular ? '👑' : '⭐'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-gray-800 mb-1">{plan.price}</div>
                    <div className="text-gray-600">/month</div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePlanSelect(plan)}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-200'
                    }`}
                  >
                    Choose {plan.name}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Why Choose Royal Six Holidays?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
              {[
                {
                  title: 'Curated Experiences',
                  description: 'Handpicked destinations and activities designed for unforgettable memories.',
                  emoji: '🎯'
                },
                {
                  title: 'Premium Service',
                  description: 'Luxury accommodations, private transportation, and personalized attention.',
                  emoji: '👑'
                },
                {
                  title: 'Local Expertise',
                  description: 'Deep local knowledge and connections for authentic cultural experiences.',
                  emoji: '🎪'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl"
                >
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6">{feature.emoji}</div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-white/80 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 sm:mb-8 px-2">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 px-4">
              Join thousands of travelers who have discovered the magic of India with us.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-2xl transition-all duration-300 touch-manipulation"
                >
                  Create Account
                </motion.button>
              </Link>
              
              <Link href="/destinations" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl border border-gray-200 shadow-xl transition-all duration-300 touch-manipulation"
                >
                  Browse Destinations
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
