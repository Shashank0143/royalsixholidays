import { useAuth } from '@/context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Main Layout Component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {boolean} props.showNavbar - Whether to show navbar
 * @param {boolean} props.showFooter - Whether to show footer
 * @param {string} props.className - Additional classes for main content
 */
const Layout = ({ 
  children, 
  showNavbar = true, 
  showFooter = true, 
  className = '' 
}) => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading RoyalSixHolidays..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {showNavbar && <Navbar />}
      
      <main className={`flex-grow ${showNavbar ? 'pt-16' : ''} ${className} w-full`}>
        <div className="w-full overflow-x-hidden">
          {children}
        </div>
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;