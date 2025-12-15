import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Share2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  FileText,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Home,
  Printer
} from 'lucide-react';
import axios from 'axios';

const PaymentConfirmation = () => {
  const router = useRouter();
  const { bookingId, status } = router.query;

  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(status || 'success'); // success, failed, pending

  // Mock booking data - replace with actual API call
  const mockBooking = {
    id: 'RSH2024001234',
    destination: 'Jaipur, Rajasthan',
    placeName: 'Royal Heritage Tour',
    packageType: 'mid-range',
    packageName: 'Comfort Getaway',
    startDate: '2024-02-15',
    endDate: '2024-02-18',
    guests: {
      adults: 2,
      children: 1
    },
    contactInfo: {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210'
    },
    totalAmount: 29997,
    amountPaid: 29997,
    paymentMethod: 'Credit Card (**** 4242)',
    transactionId: 'TXN2024789456123',
    bookingDate: new Date().toISOString(),
    status: 'confirmed'
  };

  useEffect(() => {
    const fetchBookingDetails = () => {
      if (bookingId) {
        // Simulate API call
        setTimeout(() => {
          setBookingDetails(mockBooking);
          setLoading(false);
        }, 1000);
      } else {
        setBookingDetails(mockBooking);
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);

  const handleDownloadInvoice = () => {
    // In a real app, this would download a PDF invoice
    alert('Invoice download will be implemented with PDF generation');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Trip Booking',
          text: `I just booked a trip to ${bookingDetails?.destination}!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner size="lg" text="Loading booking details..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Status Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            {paymentStatus === 'success' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-gray-600">
                  Your trip has been successfully booked. Check your email for confirmation.
                </p>
              </>
            )}

            {paymentStatus === 'failed' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <XCircle className="w-14 h-14 text-red-600" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Payment Failed
                </h1>
                <p className="text-gray-600">
                  Unfortunately, your payment could not be processed. Please try again.
                </p>
              </>
            )}

            {paymentStatus === 'pending' && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Clock className="w-14 h-14 text-yellow-600" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Payment Pending
                </h1>
                <p className="text-gray-600">
                  Your payment is being processed. We&apos;ll update you once it&apos;s confirmed.
                </p>
              </>
            )}
          </motion.div>

          {/* Success Content */}
          {paymentStatus === 'success' && bookingDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Booking ID Card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-100 text-sm">Booking Reference</p>
                    <p className="text-2xl font-bold font-mono">{bookingDetails.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Transaction ID</p>
                    <p className="font-mono">{bookingDetails.transactionId}</p>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Trip Details
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Destination</p>
                    <p className="font-semibold text-gray-900">{bookingDetails.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Package</p>
                    <p className="font-semibold text-gray-900">{bookingDetails.packageName}</p>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                      {bookingDetails.packageType}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Travel Dates
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(bookingDetails.startDate).toLocaleDateString('en-IN', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })} - {new Date(bookingDetails.endDate).toLocaleDateString('en-IN', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Travelers
                    </p>
                    <p className="font-semibold text-gray-900">
                      {bookingDetails.guests.adults} Adults
                      {bookingDetails.guests.children > 0 && `, ${bookingDetails.guests.children} Children`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{bookingDetails.contactInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{bookingDetails.contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{bookingDetails.contactInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Summary
                </h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Payment Method</span>
                    <span className="font-medium text-gray-900">{bookingDetails.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Booking Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(bookingDetails.bookingDate).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Status</span>
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Paid
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{bookingDetails.amountPaid.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button onClick={handleDownloadInvoice} className="flex-1 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Invoice
                </Button>
                <Button variant="outline" onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex-1 flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Important Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Information
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• A confirmation email has been sent to your registered email address.</li>
                  <li>• Please carry a valid ID proof during your trip.</li>
                  <li>• For any changes to your booking, please contact us at least 48 hours in advance.</li>
                  <li>• Our support team will reach out to you with detailed itinerary within 24 hours.</li>
                </ul>
              </div>

              {/* What's Next */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Confirmation Email', desc: 'Check your inbox for booking details' },
                    { step: 2, title: 'Itinerary Call', desc: 'Our team will contact you within 24 hours' },
                    { step: 3, title: 'Final Itinerary', desc: 'Receive your detailed day-wise plan' },
                    { step: 4, title: 'Trip Day!', desc: 'Enjoy your amazing journey' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/my-bookings" className="flex-1">
                  <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    View My Bookings
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button fullWidth className="flex items-center justify-center gap-2">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Failed Content */}
          {paymentStatus === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-900 mb-2">Payment Failed</h3>
                <p className="text-red-700 mb-4">
                  Your payment could not be processed. This could be due to:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  <li>Insufficient funds in your account</li>
                  <li>Card declined by your bank</li>
                  <li>Network connectivity issues</li>
                  <li>Incorrect card details</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => router.back()} className="flex-1 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Link href="/destinations" className="flex-1">
                  <Button variant="outline" fullWidth>
                    Browse Destinations
                  </Button>
                </Link>
              </div>

              <div className="text-center text-sm text-gray-600">
                Need help? Contact us at{' '}
                <a href="tel:+919876543210" className="text-blue-600 hover:underline">
                  +91 98765 43210
                </a>
              </div>
            </motion.div>
          )}

          {/* Pending Content */}
          {paymentStatus === 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-900 mb-2">Payment is Being Processed</h3>
                <p className="text-yellow-700">
                  Your payment is currently being verified. This usually takes a few minutes.
                  You will receive an email once the payment is confirmed.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-900 mb-4">While you wait...</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Do not close this page or go back
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Do not make another payment attempt
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Check your email for updates
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => window.location.reload()} variant="outline" className="flex-1 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Status
                </Button>
                <Link href="/" className="flex-1">
                  <Button fullWidth>
                    Back to Home
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* Support Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Have questions about your booking?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                <span>Call Us</span>
              </a>
              <a
                href="mailto:support@royalsixholidays.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentConfirmation;
