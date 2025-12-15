import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Edit,
  Trash2,
  Phone,
  Mail,
  CreditCard,
  RefreshCw,
  Filter,
  Search,
  Plus,
  Star,
  Package
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'cancel'
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0
  });

  // Mock bookings data - replace with API calls
  const mockBookings = [
    {
      id: 'RSH2024001234',
      bookingRef: 'BK-001234',
      destination: 'Jaipur, Rajasthan',
      packageName: 'Royal Heritage Tour',
      packageType: 'luxury',
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      guests: { adults: 2, children: 1 },
      totalAmount: 47997,
      amountPaid: 23999,
      status: 'confirmed',
      paymentStatus: 'partially_paid',
      createdAt: '2024-02-10T10:30:00Z',
      contactInfo: {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '+91 98765 43210'
      },
      itinerary: [
        { day: 1, title: 'Arrival & City Palace', activities: ['Airport pickup', 'City Palace tour', 'Local market visit'] },
        { day: 2, title: 'Amber Fort & Hawa Mahal', activities: ['Amber Fort visit', 'Elephant ride', 'Hawa Mahal photography'] },
        { day: 3, title: 'Jantar Mantar & Shopping', activities: ['Observatory visit', 'Traditional shopping', 'Cultural show'] }
      ],
      hotel: {
        name: 'The Raj Palace',
        rating: 5,
        category: 'Heritage Hotel'
      }
    },
    {
      id: 'RSH2024001235',
      bookingRef: 'BK-001235',
      destination: 'Munnar, Kerala',
      packageName: 'Hill Station Retreat',
      packageType: 'mid-range',
      startDate: '2024-04-10',
      endDate: '2024-04-13',
      guests: { adults: 2, children: 0 },
      totalAmount: 18999,
      amountPaid: 18999,
      status: 'pending',
      paymentStatus: 'paid',
      createdAt: '2024-02-25T14:15:00Z',
      contactInfo: {
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '+91 87654 32109'
      },
      itinerary: [
        { day: 1, title: 'Tea Gardens Tour', activities: ['Tea factory visit', 'Plantation walk', 'Tea tasting'] },
        { day: 2, title: 'Nature Exploration', activities: ['Echo Point visit', 'Mattupetty Dam', 'Boating'] },
        { day: 3, title: 'Trekking Adventure', activities: ['Top Station trek', 'Wildlife spotting', 'Sunset viewing'] }
      ],
      hotel: {
        name: 'Munnar Tea Country Resort',
        rating: 4,
        category: 'Resort'
      }
    },
    {
      id: 'RSH2024001230',
      bookingRef: 'BK-001230',
      destination: 'Goa Beaches',
      packageName: 'Beach Paradise',
      packageType: 'budget',
      startDate: '2024-01-15',
      endDate: '2024-01-18',
      guests: { adults: 4, children: 2 },
      totalAmount: 28997,
      amountPaid: 28997,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2023-12-20T09:00:00Z',
      contactInfo: {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '+91 76543 21098'
      },
      itinerary: [
        { day: 1, title: 'Beach Arrival', activities: ['Beach resort check-in', 'Beach volleyball', 'Sunset viewing'] },
        { day: 2, title: 'Water Sports', activities: ['Parasailing', 'Jet skiing', 'Banana boat rides'] },
        { day: 3, title: 'Cultural Tour', activities: ['Old Goa churches', 'Spice plantation', 'Local cuisine'] }
      ],
      hotel: {
        name: 'Goa Beach Resort',
        rating: 3,
        category: 'Beach Resort'
      }
    }
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/bookings');
    }
}, [authLoading, isAuthenticated, router]);

const calculateStats = (bookingData) => {
  const stats = {
    total: bookingData.length,
    upcoming: bookingData.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
    completed: bookingData.filter(b => b.status === 'completed').length,
    cancelled: bookingData.filter(b => b.status === 'cancelled').length,
    totalSpent: bookingData.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0)
  };
  setStats(stats);
};

useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        // const response = await axios.get('/api/bookings/user');
        // setBookings(response.data.bookings);
        
        // Using mock data
        setTimeout(() => {
          setBookings(mockBookings);
          calculateStats(mockBookings);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [isAuthenticated]);


  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, label: 'Confirmed' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle, label: 'Pending Confirmation' };
      case 'completed':
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle, label: 'Trip Completed' };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Cancelled' };
      default:
        return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Clock, label: status };
    }
  };

  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case 'paid':
        return { color: 'text-green-600', label: 'Fully Paid' };
      case 'partially_paid':
        return { color: 'text-orange-600', label: 'Partially Paid' };
      case 'pending':
        return { color: 'text-red-600', label: 'Payment Pending' };
      case 'refunded':
        return { color: 'text-blue-600', label: 'Refunded' };
      default:
        return { color: 'text-gray-600', label: status };
    }
  };

  const openModal = (type, booking = null) => {
    setModalType(type);
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setModalType('');
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      // await axios.post(`/api/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      // Refresh bookings
      window.location.reload();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const handleDownloadInvoice = (booking) => {
    toast.success('Downloading invoice...');
    // Implement PDF download
  };

  const filteredBookings = bookings
    .filter(booking => filter === 'all' || booking.status === filter)
    .filter(booking => 
      searchQuery === '' || 
      booking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.bookingRef.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-1">Manage all your travel bookings in one place</p>
            </div>
            <Link href="/book-trip">
              <Button className="mt-4 md:mt-0 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Booking
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: stats.total, color: 'bg-blue-500', icon: Package },
              { label: 'Upcoming', value: stats.upcoming, color: 'bg-green-500', icon: Calendar },
              { label: 'Completed', value: stats.completed, color: 'bg-purple-500', icon: CheckCircle },
              { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-500', icon: XCircle },
              { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString()}`, color: 'bg-orange-500', icon: CreditCard }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-md p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
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
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by destination or booking ref..."
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
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">
                {filter !== 'all' 
                  ? `You don't have any ${filter.replace('_', ' ')} bookings.`
                  : "You haven't made any bookings yet. Start planning your next adventure!"}
              </p>
              <Link href="/destinations">
                <Button>Explore Destinations</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking, idx) => {
                const statusConfig = getStatusConfig(booking.status);
                const paymentConfig = getPaymentStatusConfig(booking.paymentStatus);
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
                      <div className="flex flex-col xl:flex-row gap-6">
                        {/* Main Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{booking.destination}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                  <StatusIcon className="w-3 h-3 inline mr-1" />
                                  {statusConfig.label}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-1">{booking.packageName}</p>
                              <p className="text-sm text-gray-500 font-mono">Ref: {booking.bookingRef}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">₹{booking.totalAmount.toLocaleString()}</p>
                              <p className={`text-sm ${paymentConfig.color} font-medium`}>
                                {paymentConfig.label}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Travel Dates</p>
                                <p className="font-medium text-sm">
                                  {new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(booking.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Travelers</p>
                                <p className="font-medium text-sm">
                                  {booking.guests.adults} Adults{booking.guests.children > 0 && `, ${booking.guests.children} Kids`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Hotel</p>
                                <p className="font-medium text-sm">{booking.hotel?.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500">Booked On</p>
                                <p className="font-medium text-sm">
                                  {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex xl:flex-col gap-2 xl:w-48">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModal('view', booking)}
                            className="flex-1 xl:w-full flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                          
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openModal('edit', booking)}
                              className="flex-1 xl:w-full flex items-center justify-center gap-1"
                            >
                              <Edit className="w-4 h-4" />
                              Modify
                            </Button>
                          )}

                          {(booking.paymentStatus === 'paid' || booking.paymentStatus === 'partially_paid') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(booking)}
                              className="flex-1 xl:w-full flex items-center justify-center gap-1"
                            >
                              <Download className="w-4 h-4" />
                              Invoice
                            </Button>
                          )}

                          {booking.status === 'confirmed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openModal('cancel', booking)}
                              className="flex-1 xl:w-full flex items-center justify-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                              Cancel
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

          {/* Load More */}
          {filteredBookings.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline" className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Load More Bookings
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto p-6"
            >
              {modalType === 'view' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Booking Overview */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Trip Details</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Destination:</span> {selectedBooking.destination}</p>
                          <p><span className="font-medium">Package:</span> {selectedBooking.packageName}</p>
                          <p><span className="font-medium">Dates:</span> {new Date(selectedBooking.startDate).toLocaleDateString()} - {new Date(selectedBooking.endDate).toLocaleDateString()}</p>
                          <p><span className="font-medium">Travelers:</span> {selectedBooking.guests.adults} Adults, {selectedBooking.guests.children} Children</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Name:</span> {selectedBooking.contactInfo.name}</p>
                          <p><span className="font-medium">Email:</span> {selectedBooking.contactInfo.email}</p>
                          <p><span className="font-medium">Phone:</span> {selectedBooking.contactInfo.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Itinerary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Day-wise Itinerary</h3>
                      <div className="space-y-3">
                        {selectedBooking.itinerary?.map((day, idx) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Day {day.day}: {day.title}</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {day.activities.map((activity, i) => (
                                <li key={i}>• {activity}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Payment Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Total Amount:</span>
                          <span className="font-bold">₹{selectedBooking.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Amount Paid:</span>
                          <span className="font-medium text-green-600">₹{selectedBooking.amountPaid.toLocaleString()}</span>
                        </div>
                        {selectedBooking.totalAmount > selectedBooking.amountPaid && (
                          <div className="flex justify-between items-center">
                            <span>Balance Due:</span>
                            <span className="font-medium text-red-600">₹{(selectedBooking.totalAmount - selectedBooking.amountPaid).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {modalType === 'cancel' && (
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
                    <p className="text-gray-600 mt-2">Are you sure you want to cancel this booking?</p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Cancellation Policy:</strong> Cancellations made 7+ days before travel are eligible for 80% refund. 
                      Cancellations within 7 days may incur additional charges.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={closeModal} className="flex-1">
                      Keep Booking
                    </Button>
                    <Button 
                      onClick={() => {
                        handleCancelBooking(selectedBooking.id);
                        closeModal();
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      Cancel Booking
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default BookingPage;