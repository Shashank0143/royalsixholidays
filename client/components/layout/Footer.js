import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
      { label: 'Disclaimer', href: '/disclaimer' }
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
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <span className="text-gray-400">+91 99999 99999</span>
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
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
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
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.1 }}
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
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
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
              className="flex items-center space-x-6 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors">
                Accessibility
              </Link>
              <div className="text-gray-600">|</div>
              <span className="text-gray-400">Made for travelers, by travelers</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;