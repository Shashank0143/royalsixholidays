import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import AdminNotepad from '../components/admin/AdminNotepad';
import { Shield, Key, ArrowLeft } from 'lucide-react';

const DisclaimerPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showNotepad, setShowNotepad] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is the admin
  useEffect(() => {
    // Check both email and role for admin access
    const isAdminUser = user && (
      user.email === 'VB5100@gmail.com' || 
      user.role === 'admin' ||
      user.isAdmin === true
    );
    
    if (isAdminUser) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleAdminAccess = () => {
    if (isAdmin) {
      setShowNotepad(true);
    }
  };

  const handleBackFromNotepad = () => {
    setShowNotepad(false);
  };

  // Regular disclaimer content for non-admin users
  const regularDisclaimer = (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900">Disclaimer</h1>
              <p className="text-gray-600 mt-2">Terms and conditions for Royal Six Holidays</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Services Disclaimer</h2>
              
              <div className="space-y-6 text-gray-700">
                <p>
                  <strong>Royal Six Holidays</strong> provides travel booking and tourism services. 
                  By using our services, you agree to the following terms and conditions:
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking and Payments</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>All bookings are subject to availability and confirmation</li>
                    <li>Prices are subject to change without notice until booking confirmation</li>
                    <li>Full payment or deposit may be required at the time of booking</li>
                    <li>Cancellation charges apply as per our cancellation policy</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Travel Insurance</h3>
                  <p>
                    We strongly recommend purchasing comprehensive travel insurance to protect 
                    against unforeseen circumstances, medical emergencies, and trip cancellations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Liability Limitations</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Royal Six Holidays acts as an agent for various service providers</li>
                    <li>We are not liable for delays, changes, or cancellations by third parties</li>
                    <li>Force majeure events are beyond our control and responsibility</li>
                    <li>Travelers are responsible for valid documentation and health requirements</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Policy</h3>
                  <p>
                    Your personal information is protected under our privacy policy. We do not 
                    share your data with unauthorized third parties and use industry-standard 
                    security measures to protect your information.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <p>
                    For any queries, complaints, or assistance, please contact us at:
                  </p>
                  <ul className="list-none pl-0 mt-2">
                    <li><strong>Email:</strong> support@royalsixholidays.com</li>
                    <li><strong>Phone:</strong> +91 98765 43210</li>
                    <li><strong>Address:</strong> Royal Six Holidays, Tourism Plaza, New Delhi</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
                  <p className="text-yellow-800 text-sm">
                    <strong>Last Updated:</strong> December 15, 2025
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    This disclaimer is subject to change without prior notice. Please review 
                    regularly for updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <motion.button
                onClick={() => router.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mx-auto transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );

  // Admin access interface
  const adminInterface = (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-8 text-white text-center"
          >
            <Key className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">🔐 Admin Access Detected</h1>
            <p className="text-gray-300 mb-8">
              Welcome back, Administrator. You have special access to the secure notepad system.
            </p>
            
            <div className="space-y-4">
              <motion.button
                onClick={handleAdminAccess}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300"
              >
                🔓 Access Secure Notepad
              </motion.button>
              
              <motion.button
                onClick={() => router.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Return to Previous Page
              </motion.button>
            </div>

            <div className="mt-8 text-sm text-gray-400">
              <p>⚠️ Secure notepad sessions auto-expire after 24 hours</p>
              <p>🔐 All data is encrypted and locally stored</p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );

  // Show notepad for admin
  if (showNotepad && isAdmin) {
    return <AdminNotepad onBack={handleBackFromNotepad} />;
  }

  // Show admin interface if logged in as admin
  if (isAdmin && !showNotepad) {
    return adminInterface;
  }

  // Show regular disclaimer for everyone else
  return regularDisclaimer;
};

export default DisclaimerPage;