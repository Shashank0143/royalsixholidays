import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  MapPin,
  Calendar,
  Star,
  Heart,
  Share2,
  Clock,
  Users,
  Camera,
  Sun,
  CloudRain,
  Thermometer,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';

const DestinationDetailPage = () => {
  const router = useRouter();
  const { state, destination } = router.query;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [destinationData, setDestinationData] = useState(null);

  // Mock data - replace with API call
  const mockDestinations = {
    'rajasthan': {
      'jaipur': {
        id: '1',
        name: 'Jaipur',
        state: 'Rajasthan',
        tagline: 'The Pink City',
        description: 'Jaipur, the capital of Rajasthan, is a vibrant blend of ancient royal heritage and modern urban planning. Known as the Pink City due to the distinctive color of its buildings, Jaipur offers magnificent forts, opulent palaces, and a rich cultural experience.',
        images: [
          'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
          'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?w=800',
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
          'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800'
        ],
        rating: 4.7,
        reviews: 2847,
        basePrice: 4999,
        duration: '3-5 days recommended',
        bestTime: 'October - March',
        weather: { temp: '25°C', condition: 'Sunny' },
        highlights: [
          'Amber Fort - Stunning hilltop fortress',
          'Hawa Mahal - Palace of Winds',
          'City Palace - Royal residence museum',
          'Jantar Mantar - Ancient astronomical observatory',
          'Nahargarh Fort - Panoramic city views',
          'Jal Mahal - Water Palace'
        ],
        activities: [
          { name: 'Elephant Ride at Amber Fort', price: 1200, duration: '1 hour' },
          { name: 'Hot Air Balloon Ride', price: 8000, duration: '1 hour' },
          { name: 'Traditional Rajasthani Cooking Class', price: 2500, duration: '3 hours' },
          { name: 'Heritage Walking Tour', price: 500, duration: '2 hours' },
          { name: 'Textile & Block Printing Workshop', price: 1500, duration: '2 hours' }
        ],
        packages: [
          { type: 'budget', name: 'Budget Explorer', price: 4999, nights: 2, includes: ['2 nights stay', 'Breakfast', 'Sightseeing'] },
          { type: 'mid-range', name: 'Comfort Getaway', price: 9999, nights: 3, includes: ['3 nights 4-star hotel', 'All meals', 'AC transport', 'Guide'] },
          { type: 'luxury', name: 'Royal Experience', price: 24999, nights: 4, includes: ['4 nights 5-star palace hotel', 'Fine dining', 'Private car', 'Personal guide', 'Spa'] }
        ],
        faqs: [
          { q: 'What is the best time to visit Jaipur?', a: 'October to March is ideal with pleasant weather. Avoid summer months (April-June) due to extreme heat.' },
          { q: 'How many days are enough for Jaipur?', a: '3-4 days are ideal to explore major attractions. Add 1-2 days for nearby Ajmer and Pushkar.' },
          { q: 'Is Jaipur safe for solo travelers?', a: 'Yes, Jaipur is generally safe. The tourist areas are well-patrolled. Standard precautions apply.' }
        ],
        nearbyPlaces: ['Ajmer', 'Pushkar', 'Ranthambore', 'Udaipur']
      },
      'udaipur': {
        id: '2',
        name: 'Udaipur',
        state: 'Rajasthan',
        tagline: 'City of Lakes',
        description: 'Udaipur, often called the "Venice of the East", is a romantic city known for its beautiful lakes, magnificent palaces, and rich cultural heritage. The city offers a perfect blend of natural beauty and royal grandeur.',
        images: [
          'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
          'https://images.unsplash.com/photo-1524230507669-5ff97982bb5e?w=800',
          'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800',
          'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800'
        ],
        rating: 4.8,
        reviews: 3256,
        basePrice: 5999,
        duration: '3-4 days recommended',
        bestTime: 'September - March',
        weather: { temp: '24°C', condition: 'Pleasant' },
        highlights: [
          'City Palace - Largest palace complex in Rajasthan',
          'Lake Pichola - Scenic boat rides',
          'Jag Mandir - Island palace',
          'Monsoon Palace - Hilltop sunset views',
          'Jagdish Temple - 17th century carved temple',
          'Fateh Sagar Lake - Leisure activities'
        ],
        activities: [
          { name: 'Sunset Boat Ride on Lake Pichola', price: 800, duration: '1 hour' },
          { name: 'Dinner at Lake Palace', price: 5000, duration: '2 hours' },
          { name: 'Folk Dance Show at Bagore Ki Haveli', price: 150, duration: '1 hour' },
          { name: 'Vintage Car Museum Visit', price: 250, duration: '1.5 hours' }
        ],
        packages: [
          { type: 'budget', name: 'Lake City Explorer', price: 5999, nights: 2, includes: ['2 nights stay', 'Breakfast', 'Boat ride'] },
          { type: 'mid-range', name: 'Romantic Retreat', price: 12999, nights: 3, includes: ['3 nights lake-view hotel', 'All meals', 'Private tour', 'Sunset cruise'] },
          { type: 'luxury', name: 'Palace Experience', price: 34999, nights: 4, includes: ['4 nights heritage hotel', 'Royal dining', 'Private yacht', 'Spa', 'Butler service'] }
        ],
        faqs: [
          { q: 'Is Udaipur expensive?', a: 'Udaipur offers options for all budgets. Budget travelers can manage with ₹2000-3000/day, while luxury can go up to ₹50,000+/day.' },
          { q: 'How to reach Udaipur?', a: 'Udaipur has its own airport with connections to major cities. Railway station connects to Delhi, Mumbai, and Jaipur.' }
        ],
        nearbyPlaces: ['Mount Abu', 'Chittorgarh', 'Kumbhalgarh', 'Ranakpur']
      }
    },
    'kerala': {
      'munnar': {
        id: '3',
        name: 'Munnar',
        state: 'Kerala',
        tagline: 'Paradise of Tea Gardens',
        description: 'Munnar is a breathtaking hill station nestled in the Western Ghats of Kerala. Famous for its rolling tea plantations, misty mountains, and diverse flora and fauna, it offers a refreshing escape into nature.',
        images: [
          'https://images.unsplash.com/photo-1598977054780-0d2e09be14c9?w=800',
          'https://images.unsplash.com/photo-1609766856923-7e0a0c06a920?w=800',
          'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800'
        ],
        rating: 4.6,
        reviews: 1892,
        basePrice: 5499,
        duration: '2-4 days recommended',
        bestTime: 'September - May',
        weather: { temp: '18°C', condition: 'Cool & Misty' },
        highlights: [
          'Tea Gardens - Endless emerald hills',
          'Eravikulam National Park - Nilgiri Tahr habitat',
          'Top Station - Highest point with stunning views',
          'Mattupetty Dam - Boating & picnic spot',
          'Echo Point - Natural echo phenomenon',
          'Anamudi Peak - Highest peak in South India'
        ],
        activities: [
          { name: 'Tea Factory Visit & Tasting', price: 200, duration: '1 hour' },
          { name: 'Trekking to Anamudi Peak', price: 1500, duration: '6 hours' },
          { name: 'Elephant Safari', price: 800, duration: '30 mins' },
          { name: 'Spice Plantation Tour', price: 500, duration: '2 hours' }
        ],
        packages: [
          { type: 'budget', name: 'Hill Station Escape', price: 5499, nights: 2, includes: ['2 nights homestay', 'Breakfast', 'Tea garden tour'] },
          { type: 'mid-range', name: 'Nature Retreat', price: 11999, nights: 3, includes: ['3 nights resort', 'All meals', 'Safari', 'Trekking'] },
          { type: 'luxury', name: 'Wellness & Nature', price: 28999, nights: 4, includes: ['4 nights luxury resort', 'Spa treatments', 'Private tours', 'Gourmet meals'] }
        ],
        faqs: [
          { q: 'What is the weather like in Munnar?', a: 'Munnar has pleasant weather year-round. Temperatures range from 10°C to 25°C. Monsoons (June-August) bring heavy rainfall.' },
          { q: 'Is Munnar suitable for families?', a: 'Absolutely! Munnar is perfect for families with its scenic beauty, safe environment, and activities for all ages.' }
        ],
        nearbyPlaces: ['Thekkady', 'Alleppey', 'Kochi', 'Vagamon']
      }
    }
  };

  useEffect(() => {
    const fetchDestinationData = () => {
      if (state && destination) {
        // Simulate API call
        setTimeout(() => {
          const stateData = mockDestinations[state.toLowerCase()];
          if (stateData) {
            const destData = stateData[destination.toLowerCase()];
            setDestinationData(destData);
          }
          setLoading(false);
        }, 500);
      }
    };
    
    fetchDestinationData();
  }, [state, destination]);

  const nextImage = () => {
    if (destinationData) {
      setCurrentImageIndex((prev) => 
        prev === destinationData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (destinationData) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? destinationData.images.length - 1 : prev - 1
      );
    }
  };

  const handleBookNow = (packageType) => {
    router.push({
      pathname: '/book-trip',
      query: {
        destinationId: destinationData?.id,
        placeId: destinationData?.id,
        placeName: destinationData?.name,
        destinationName: destinationData?.state,
        package: packageType
      }
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading destination..." />
        </div>
      </Layout>
    );
  }

  if (!destinationData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h2>
            <p className="text-gray-600 mb-6">The destination you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/destinations')}>
              Explore Destinations
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Image Gallery */}
        <div className="relative h-[60vh] overflow-hidden">
          <motion.img
            key={currentImageIndex}
            src={destinationData.images[currentImageIndex]}
            alt={destinationData.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {destinationData.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-full backdrop-blur-sm transition ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <div className="absolute bottom-12 left-0 right-0 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{destinationData.state}, India</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {destinationData.name}
                </h1>
                <p className="text-xl text-white/80">{destinationData.tagline}</p>
                
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{destinationData.rating}</span>
                    <span className="text-white/70">({destinationData.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>{destinationData.duration}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="bg-white shadow-md sticky top-16 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">
                    <strong>Best Time:</strong> {destinationData.bestTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <span className="text-sm">
                    <strong>{destinationData.weather.temp}</strong> - {destinationData.weather.condition}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Starting from</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{destinationData.basePrice.toLocaleString()}
                </span>
                <Button onClick={() => handleBookNow('mid-range')}>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-8 overflow-x-auto">
              {['overview', 'packages', 'activities', 'faqs'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About {destinationData.name}</h2>
                    <p className="text-gray-600 leading-relaxed">{destinationData.description}</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Highlights</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {destinationData.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Places */}
                  <div className="bg-white rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Places</h2>
                    <div className="flex flex-wrap gap-3">
                      {destinationData.nearbyPlaces.map((place, idx) => (
                        <Link
                          key={idx}
                          href={`/explore/${state}/${place.toLowerCase()}`}
                          className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
                        >
                          {place}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Packages Tab */}
              {activeTab === 'packages' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {destinationData.packages.map((pkg, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-xl p-6 shadow-md border-2 ${
                        pkg.type === 'mid-range' ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      {pkg.type === 'mid-range' && (
                        <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full mb-4 inline-block">
                          Most Popular
                        </span>
                      )}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                          <p className="text-gray-500">{pkg.nights} Nights / {pkg.nights + 1} Days</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-600">₹{pkg.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">per person</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Includes:</h4>
                        <ul className="grid md:grid-cols-2 gap-2">
                          {pkg.includes.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600">
                              <Check className="w-4 h-4 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        fullWidth 
                        variant={pkg.type === 'mid-range' ? 'primary' : 'outline'}
                        onClick={() => handleBookNow(pkg.type)}
                      >
                        Select Package
                      </Button>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Activities Tab */}
              {activeTab === 'activities' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {destinationData.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-6 shadow-md flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {activity.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₹{activity.price.toLocaleString()}</p>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* FAQs Tab */}
              {activeTab === 'faqs' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {destinationData.faqs.map((faq, idx) => (
                    <details
                      key={idx}
                      className="bg-white rounded-xl shadow-md overflow-hidden group"
                    >
                      <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50">
                        {faq.q}
                        <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Book Card */}
              <div className="bg-white rounded-xl p-6 shadow-md sticky top-36">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Enquiry</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <Button fullWidth>Get Callback</Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-3">Or contact us directly:</p>
                  <div className="space-y-2">
                    <a href="tel:+919876543210" className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Phone className="w-4 h-4" />
                      +91 98765 43210
                    </a>
                    <a href="#" className="flex items-center gap-2 text-green-600 hover:underline">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DestinationDetailPage;
