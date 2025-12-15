import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Download,
  Share2,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Home,
  Package,
  CreditCard,
  FileText
} from 'lucide-react';

const BookingSuccessPage = () => {
  const router = useRouter();
  const { bookingRef, amount } = router.query;
  
  const [confettiVisible, setConfettiVisible] = useState(true);

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => {
      setConfettiVisible(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock booking confirmation data
  const bookingData = {
    id: 'RSH2024001234',
    bookingRef: bookingRef || 'BK-001234',
    destination: 'Jaipur, Rajasthan',
    packageName: 'Royal Heritage Tour',
    packageType: 'luxury',
    startDate: '2024-03-15',
    endDate: '2024-03-18',
    guests: { adults: 2, children: 1 },
    totalAmount: amount ? parseInt(amount) : 47997,
    amountPaid: amount ? parseInt(amount) : 47997,
    status: 'confirmed',
    bookingDate: new Date().toISOString(),
    contactInfo: {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+91 98765 43210'
    },
    hotel: {
      name: 'The Raj Palace',
      rating: 5,
      category: 'Heritage Hotel',
      checkIn: '3:00 PM',
      checkOut: '11:00 AM'
    }
  };

  const nextSteps = [
    {
      icon: Mail,
      title: 'Confirmation Email Sent',
      description: 'Check your inbox for detailed booking information',
      status: 'completed'
    },
    {
      icon: Phone,
      title: 'Travel Consultant Call',
      description: 'Our team will contact you within 2 hours to finalize details',
      status: 'pending',
      time: 'Within 2 hours'
    },
    {
      icon: FileText,
      title: 'Detailed Itinerary',
      description: 'Receive your complete day-wise travel plan',
      status: 'pending',
      time: 'Within 24 hours'
    },
    {
      icon: Package,
      title: 'Travel Documents',
      description: 'Get your travel vouchers and necessary documents',
      status: 'pending',
      time: '3-5 days before travel'
    }
  ];

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Amazing Trip Booking!',
          text: `I just booked an amazing trip to ${bookingData.destination} with RoyalSixHolidays!`,
          url: window.location.origin
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(`I just booked an amazing trip to ${bookingData.destination} with RoyalSixHolidays! Check out: ${window.location.origin}`);
      alert('Booking details copied to clipboard!');
    }
  };

  const handleDownloadConfirmation = () => {
    // Generate and download confirmation PDF
    alert('Downloading booking confirmation...');
  };

  return (
    <Layout>
      {/* Confetti Background */}
      {confettiVisible && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"
              initial={{
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1200,
                y: -10,
                rotation: 0
              }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 10 : 800,
                rotation: 360
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Booking Confirmed! 🎉
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-600 mb-6"
            >
              Your amazing journey to {bookingData.destination} is all set!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-2xl shadow-lg p-6 inline-block"
            >
              <p className="text-gray-600 text-sm mb-1">Booking Reference</p>
              <p className="text-2xl font-bold text-blue-600 font-mono">{bookingData.bookingRef}</p>
            </motion.div>
          </motion.div>

          {/* Booking Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-600" />
              Booking Summary
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Trip Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trip Details</h3>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{bookingData.destination}</p>
                    <p className="text-gray-600 text-sm">{bookingData.packageName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Travel Dates</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(bookingData.startDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} - {new Date(bookingData.endDate).toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Travelers</p>
                    <p className="text-gray-600 text-sm">
                      {bookingData.guests.adults} Adult{bookingData.guests.adults > 1 ? 's' : ''}
                      {bookingData.guests.children > 0 && `, ${bookingData.guests.children} Child${bookingData.guests.children > 1 ? 'ren' : ''}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Hotel Check-in/out</p>
                    <p className="text-gray-600 text-sm">
                      Check-in: {bookingData.hotel.checkIn} | Check-out: {bookingData.hotel.checkOut}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment & Hotel Info */}
              <div className="space-y-6">
                {/* Payment Summary */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    Payment Confirmed
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-gray-900">₹{bookingData.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-bold text-green-600">₹{bookingData.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Status:</span>
                        <span className="font-bold text-green-600">✓ PAID</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Accommodation</h3>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">{bookingData.hotel.name}</p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {bookingData.hotel.rating} Star {bookingData.hotel.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
            
            <div className="space-y-6">
              {nextSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.2 }}
                  className="flex items-start gap-4"
                >
                  <div className={`p-3 rounded-full ${
                    step.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <step.icon className={`w-5 h-5 ${
                      step.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      {step.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {step.time && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          {step.time}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Need Help? We're Here for You!</h2>
              <p className="text-blue-100 mb-6">
                Our travel experts are available 24/7 to assist you with any questions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  <Phone className="w-5 h-5" />
                  +91 98765 43210
                </a>
                <a
                  href="mailto:support@royalsixholidays.com"
                  className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
                >
                  <Mail className="w-5 h-5" />
                  Email Support
                </a>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={handleDownloadConfirmation}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-5 h-5" />
              Download Confirmation
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Your Trip
            </Button>
            
            <Link href="/bookings" className="flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                View All Bookings
              </Button>
            </Link>
            
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Home className="w-5 h-5" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Promotional Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-orange-400 to-pink-400 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Planning Your Next Adventure?</h3>
              <p className="text-orange-100 mb-4">Get 15% off on your next booking when you refer a friend!</p>
              <Link href="/destinations">
                <Button className="bg-white text-orange-500 hover:bg-orange-50 flex items-center gap-2">
                  Explore More Destinations
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingSuccessPage;