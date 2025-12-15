import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';

const MyBookingsPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock bookings data
  const mockBookings = [
    {
      id: 'RSH2024001234',
      destination: 'Jaipur, Rajasthan',
      packageName: 'Comfort Getaway',
      startDate: '2024-02-15',
      endDate: '2024-02-18',
      guests: { adults: 2, children: 1 },
      totalAmount: 29997,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2024-01-20T10:30:00Z'
    },
    {
      id: 'RSH2024001235',
      destination: 'Udaipur, Rajasthan',
      packageName: 'Royal Luxury',
      startDate: '2024-03-10',
      endDate: '2024-03-14',
      guests: { adults: 2, children: 0 },
      totalAmount: 69998,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2024-01-25T14:15:00Z'
    },
    {
      id: 'RSH2024001230',
      destination: 'Munnar, Kerala',
      packageName: 'Nature Retreat',
      startDate: '2024-01-05',
      endDate: '2024-01-08',
      guests: { adults: 2, children: 2 },
      totalAmount: 47996,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2023-12-20T09:00:00Z'
    },
    {
      id: 'RSH2024001228',
      destination: 'Goa',
      packageName: 'Beach Paradise',
      startDate: '2023-12-25',
      endDate: '2023-12-28',
      guests: { adults: 4, children: 0 },
      totalAmount: 35996,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2023-12-10T16:45:00Z'
    }
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/my-bookings');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      // In production, fetch from API
      // const res = await axios.get('/api/bookings/user');
      // setBookings(res.data.bookings);
      
      // Using mock data
      setTimeout(() => {
        setBookings(mockBookings);
        setLoading(false);
      }, 500);
    };
    
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Confirmed' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle, label: 'Pending' };
      case 'completed':
        return { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Completed' };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: Clock, label: status };
    }
  };

  const filteredBookings = bookings
    .filter(booking => filter === 'all' || booking.status === filter)
    .filter(booking => 
      searchQuery === '' || 
      booking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner size="lg" text="Loading your bookings..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">View and manage all your trip bookings</p>
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Filter Tabs */}
              <div className="flex gap-2 flex-wrap">
                {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {filter !== 'all' 
                  ? `You don't have any ${filter} bookings.`
                  : "You haven't made any bookings yet."}
              </p>
              <Link href="/destinations">
                <Button>Explore Destinations</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking, idx) => {
                const statusConfig = getStatusConfig(booking.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Booking Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-sm text-gray-500 font-mono">#{booking.id}</p>
                              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" />
                                {booking.destination}
                              </h3>
                              <p className="text-gray-600">{booking.packageName}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.color}`}>
                              <StatusIcon className="w-4 h-4" />
                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-gray-500">Travel Dates</p>
                              <p className="font-medium text-gray-900 flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(booking.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Travelers</p>
                              <p className="font-medium text-gray-900 flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                {booking.guests.adults} Adults{booking.guests.children > 0 && `, ${booking.guests.children} Kids`}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Amount</p>
                              <p className="font-bold text-blue-600">
                                ₹{booking.totalAmount.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Booked On</p>
                              <p className="font-medium text-gray-900">
                                {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2">
                          <Link href={`/booking/${booking.id}`} className="flex-1">
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </Button>
                          </Link>
                          {booking.status === 'confirmed' && (
                            <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                              <Download className="w-4 h-4" />
                              Invoice
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Total Bookings', value: bookings.length, color: 'bg-blue-100 text-blue-600' },
              { label: 'Upcoming', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-100 text-green-600' },
              { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-purple-100 text-purple-600' },
              { label: 'Total Spent', value: `₹${bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}`, color: 'bg-orange-100 text-orange-600' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyBookingsPage;
