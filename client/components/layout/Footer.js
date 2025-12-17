import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  Lock,
  X
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  
  const LEGAL_PRIVACY_CODE = process.env.NEXT_PUBLIC_PRIVACY_CODE; // You can change this code

  const handleLegalPrivacyClick = (e) => {
    e.preventDefault();
    setShowCodeModal(true);
    setCodeInput('');
    setCodeError('');
  };

  const handleCodeSubmit = () => {
    if (codeInput === LEGAL_PRIVACY_CODE) {
      setShowCodeModal(false);
      // Store access in sessionStorage and redirect to disclaimer page
      sessionStorage.setItem('legalPrivacyAccess', 'true');
      router.push('/disclaimer?legalPrivacy=true');
    } else {
      setCodeError('Invalid code. Please try again.');
      setCodeInput('');
    }
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCodeInput(value);
    setCodeError('');
  };

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' }
    ],
    support: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help Center', href: '/help' },
      { label: 'Safety', href: '/safety' },
      { label: 'Cancellation Policy', href: '/cancellation' }
    ],
    legal: [
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Legal Privacy', href: '#legal-privacy', special: true }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/royalsixholidays', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/royalsixholidays', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/royalsixholidays', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/royalsixholidays', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 md:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
                <MapPin className="w-6 h-6 text-blue-400" />
                <span>RoyalSixHolidays</span>
              </Link>
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                Discover incredible destinations across India with our expertly curated travel experiences. 
                From cultural heritage to natural wonders, we make your dream journey a reality.
              </p>
            </motion.div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">info@royalsixholidays.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-gray-400">+91 8929889345</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  {link.special ? (
                    <button 
                      onClick={handleLegalPrivacyClick}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-1 group"
                    >
                      <Lock className="w-3 h-3 group-hover:text-yellow-400 transition-colors" />
                      <span>{link.label}</span>
                    </button>
                  ) : (
                    <Link 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors touch-manipulation"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-center md:text-left">
            <motion.p 
              className="text-gray-400 text-sm flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              © {currentYear} RoyalSixHolidays. Made with{' '}
              <Heart className="w-4 h-4 text-red-500 mx-1" />
              in India. All rights reserved.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 sm:space-x-6">
                <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                  Sitemap
                </Link>
                <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                  Accessibility
                </Link>
              </div>
              <div className="hidden sm:block text-gray-600">|</div>
              <span className="text-gray-400">Made for travelers, by travelers</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Legal Privacy Code Modal */}
      <AnimatePresence>
        {showCodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-75"
              onClick={() => setShowCodeModal(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCodeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Modal Content */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal Privacy Access</h2>
                <p className="text-gray-600 mb-6">Enter the 4-digit access code</p>

                {/* Code Input */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={handleCodeChange}
                    placeholder="Enter 4-digit code"
                    className="w-full text-center text-2xl font-mono tracking-widest border-2 border-gray-300 rounded-lg py-3 px-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                    maxLength={4}
                    autoFocus
                  />
                </div>

                {/* Error Message */}
                {codeError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mb-4"
                  >
                    {codeError}
                  </motion.p>
                )}

                {/* Submit Button */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCodeModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCodeSubmit}
                    disabled={codeInput.length !== 4}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Access
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  This area is restricted to authorized personnel only
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;