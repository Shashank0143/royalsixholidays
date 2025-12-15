import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './ui/LoadingSpinner';

/**
 * Protected Route Component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} props.requireAuth - Whether authentication is required
 * @param {boolean} props.requireSubscription - Whether subscription is required
 * @param {string} props.redirectTo - Where to redirect if not authenticated
 * @param {React.ReactNode} props.fallback - Fallback component while loading
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireSubscription = false,
  redirectTo = '/auth/login',
  fallback = <LoadingSpinner />
}) => {
  const { isAuthenticated, subscription, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Check authentication
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Check subscription
      if (requireSubscription && isAuthenticated && !subscription.isSubscribed) {
        router.push('/subscription');
        return;
      }
    }
  }, [isLoading, isAuthenticated, subscription.isSubscribed, requireAuth, requireSubscription, router, redirectTo]);

  // Show loading while checking auth status
  if (isLoading) {
    return fallback;
  }

  // Show loading while redirecting
  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  // Show loading while redirecting for subscription
  if (requireSubscription && isAuthenticated && !subscription.isSubscribed) {
    return fallback;
  }

  return children;
};

export default ProtectedRoute;