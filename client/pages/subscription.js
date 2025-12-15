import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Shield, 
  MapPin, 
  Headphones, 
  Gift,
  CreditCard,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  const { user, isAuthenticated, subscription, updateSubscription } = useAuth();
  const router = useRouter();

  const plans = {
    monthly: {
      basic: {
        name: 'Basic Explorer',
        price: 299,
        originalPrice: 499,
        period: 'month',
        icon: Star,
        color: 'blue',
        features: [
          'Access to 50+ destinations',
          'Basic trip planning tools',
          'Email support',
          '5% discount on bookings',
          'Travel tips & guides'
        ],
        notIncluded: [
          'Priority booking',
          '24/7 support',
          'Free cancellation',
          'Exclusive deals'
        ]
      },
      premium: {
        name: 'Premium Traveler',
        price: 599,
        originalPrice: 999,
        period: 'month',
        icon: Crown,
        color: 'purple',
        popular: true,
        features: [
          'Access to all destinations',
          'Advanced trip planning',
          'Priority customer support',
          '15% discount on bookings',
          'Free cancellation up to 48hrs',
          'Exclusive member deals',
          'Travel insurance included',
          'Airport pickup/drop'
        ],
        notIncluded: []
      },
      enterprise: {
        name: 'Royal Elite',
        price: 999,
        originalPrice: 1499,
        period: 'month',
        icon: Shield,
        color: 'gold',
        features: [
          'Everything in Premium',
          'Personal travel concierge',
          '24/7 dedicated support',
          '25% discount on bookings',
          'Free cancellation anytime',
          'VIP lounge access',
          'Luxury upgrades',
          'Custom itinerary planning',
          'Family & group packages'
        ],
        notIncluded: []
      }
    },
    yearly: {
      basic: {
        name: 'Basic Explorer',
        price: 2499,
        originalPrice: 5988,
        period: 'year',
        icon: Star,
        color: 'blue',
        savings: '₹3,489 saved',
        features: [
          'Access to 50+ destinations',
          'Basic trip planning tools',
          'Email support',
          '5% discount on bookings',
          'Travel tips & guides'
        ],
        notIncluded: [
          'Priority booking',
          '24/7 support',
          'Free cancellation',
          'Exclusive deals'
        ]
      },
      premium: {
        name: 'Premium Traveler',
        price: 4999,
        originalPrice: 11988,
        period: 'year',
        icon: Crown,
        color: 'purple',
        popular: true,
        savings: '₹6,989 saved',
        features: [
          'Access to all destinations',
          'Advanced trip planning',
          'Priority customer support',
          '15% discount on bookings',
          'Free cancellation up to 48hrs',
          'Exclusive member deals',
          'Travel insurance included',
          'Airport pickup/drop'
        ],
        notIncluded: []
      },
      enterprise: {
        name: 'Royal Elite',
        price: 8999,
        originalPrice: 17988,
        period: 'year',
        icon: Shield,
        color: 'gold',
        savings: '₹8,989 saved',
        features: [
          'Everything in Premium',
          'Personal travel concierge',
          '24/7 dedicated support',
          '25% discount on bookings',
          'Free cancellation anytime',
          'VIP lounge access',
          'Luxury upgrades',
          'Custom itinerary planning',
          'Family & group packages'
        ],
        notIncluded: []
      }
    }
  };

  const handleSubscribe = async (planKey) => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe');
      router.push('/auth/login?redirect=/subscription');
      return;
    }

    setIsLoading(true);
    setSelectedPlan(planKey);

    try {
      const response = await axios.post('/api/subscription/subscribe', {
        planType: billingCycle,
        planKey: planKey
      });

      if (response.data.success) {
        toast.success('Subscription activated successfully!');
        updateSubscription({
          isSubscribed: true,
          planType: billingCycle,
          expiryDate: response.data.expiryDate
        });
        router.push('/payment/confirmation?type=subscription&plan=' + planKey);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        bgLight: 'bg-blue-50',
        text: 'text-blue-600',
        border: 'border-blue-500',
        hover: 'hover:bg-blue-600'
      },
      purple: {
        bg: 'bg-purple-500',
        bgLight: 'bg-purple-50',
        text: 'text-purple-600',
        border: 'border-purple-500',
        hover: 'hover:bg-purple-600'
      },
      gold: {
        bg: 'bg-amber-500',
        bgLight: 'bg-amber-50',
        text: 'text-amber-600',
        border: 'border-amber-500',
        hover: 'hover:bg-amber-600'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
        {/* Header Section */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            💎 Premium Membership
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Travel Adventure
          </h1>
          <p className="text-xl text-gray-600">
            Unlock exclusive benefits, discounts, and premium features for your dream vacations
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-full p-1 shadow-md flex gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 50%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Current Subscription Status */}
        {subscription?.isSubscribed && (
          <motion.div
            className="max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Active Subscription</p>
                  <p className="text-sm text-green-600">
                    Your {subscription.planType} plan is active until {new Date(subscription.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage Subscription
              </Button>
            </div>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          {Object.entries(plans[billingCycle]).map(([key, plan], index) => {
            const colors = getColorClasses(plan.color);
            const IconComponent = plan.icon;

            return (
              <motion.div
                key={key}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Header */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${colors.bgLight} mb-4`}>
                    <IconComponent className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                      <span className="text-gray-500">/{plan.period}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400 line-through">₹{plan.originalPrice.toLocaleString()}</span>
                      {plan.savings && (
                        <span className="text-sm text-green-600 font-medium">{plan.savings}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((feature, idx) => (
                      <li key={`not-${idx}`} className="flex items-start gap-3 opacity-50">
                        <span className="w-5 h-5 flex items-center justify-center text-gray-400">✕</span>
                        <span className="text-gray-400 text-sm line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Subscribe Button */}
                  <Button
                    onClick={() => handleSubscribe(key)}
                    loading={isLoading && selectedPlan === key}
                    disabled={isLoading}
                    fullWidth
                    variant={plan.popular ? 'primary' : 'outline'}
                    className={plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}
                  >
                    {subscription?.isSubscribed ? 'Upgrade Plan' : 'Get Started'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose RoyalSixHolidays Membership?
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: MapPin, title: '500+ Destinations', desc: 'Explore curated locations across India' },
              { icon: Headphones, title: '24/7 Support', desc: 'Round the clock travel assistance' },
              { icon: Gift, title: 'Exclusive Deals', desc: 'Members-only discounts & offers' },
              { icon: Shield, title: 'Safe & Secure', desc: 'Protected bookings & payments' }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="max-w-3xl mx-auto mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time. For premium members, you\'ll continue to have access until your billing period ends.'
              },
              {
                q: 'How do the discounts work?',
                a: 'Discounts are automatically applied at checkout for all bookings made through your member account.'
              },
              {
                q: 'Can I upgrade my plan later?',
                a: 'Absolutely! You can upgrade your plan at any time. The price difference will be prorated for the remaining period.'
              },
              {
                q: 'Is the travel insurance included for all destinations?',
                a: 'Travel insurance is included for Premium and Elite members for all domestic destinations. International coverage requires additional verification.'
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden group"
              >
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50">
                  {faq.q}
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          className="max-w-2xl mx-auto mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">30-Day Money Back Guarantee</h3>
            <p className="text-green-100">
              Not satisfied? Get a full refund within 30 days, no questions asked.
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
