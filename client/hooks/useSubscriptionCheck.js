import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook to check subscription status and redirect if needed
 * @param {boolean} requireSubscription - Whether subscription is required
 * @param {string} redirectTo - Where to redirect if subscription is required
 * @returns {object} Subscription status and utilities
 */
export const useSubscriptionCheck = (requireSubscription = false, redirectTo = '/subscription') => {
  const { subscription, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireSubscription && isAuthenticated) {
      if (!subscription.isSubscribed) {
        toast.error('Subscription required to access this content');
        router.push(redirectTo);
      }
    }
  }, [isLoading, requireSubscription, isAuthenticated, subscription.isSubscribed, router, redirectTo]);

  return {
    isSubscribed: subscription.isSubscribed,
    planType: subscription.planType,
    expiryDate: subscription.expiryDate,
    daysRemaining: subscription.daysRemaining,
    hasAccess: !requireSubscription || subscription.isSubscribed,
    isLoading
  };
};