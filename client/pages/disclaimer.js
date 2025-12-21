import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import AdminNotepad from '../components/admin/AdminNotepad';
import { Shield, Key, ArrowLeft } from 'lucide-react';

const DisclaimerPage = () => {
  const router = useRouter();
  const [showNotepad, setShowNotepad] = useState(false);
  const [legalPrivacyAccess, setLegalPrivacyAccess] = useState(false);

  // Check if coming from Legal Privacy access (via router query or sessionStorage)
  useEffect(() => {
    const { legalPrivacy } = router.query;
    const storedAccess = sessionStorage.getItem('legalPrivacyAccess');
    
    if (legalPrivacy === 'true' || storedAccess === 'true') {
      setLegalPrivacyAccess(true);
      setShowNotepad(true);
      // Store access in sessionStorage for the session
      sessionStorage.setItem('legalPrivacyAccess', 'true');
      // Clean up the URL
      if (legalPrivacy) {
        router.replace('/disclaimer', undefined, { shallow: true });
      }
    }
  }, [router]);

  const handleBackFromNotepad = () => {
    setShowNotepad(false);
    // Clear the access and redirect to home
    sessionStorage.removeItem('legalPrivacyAccess');
    setLegalPrivacyAccess(false);
    router.push('/');
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

  // Show notepad if legal privacy access is granted
  if (showNotepad && legalPrivacyAccess) {
    return <AdminNotepad onBack={handleBackFromNotepad} />;
  }

  // Show regular disclaimer for everyone else
  return regularDisclaimer;
};

export default DisclaimerPage;