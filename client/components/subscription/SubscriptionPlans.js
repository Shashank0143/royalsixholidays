import { motion } from 'framer-motion';
import { Check, Crown, Star } from 'lucide-react';

const SubscriptionCard = ({ plan, isPopular = false, onSelect }) => {
  const features = plan.features || [
    'Access to all destinations',
    'Priority booking',
    '24/7 customer support',
    'Cancellation protection'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden ${
        isPopular ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1"
          >
            <Crown className="w-4 h-4" />
            <span>Most Popular</span>
          </motion.div>
        </div>
      )}

      <div className="p-8">
        {/* Plan Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              plan.type === 'premium' 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                : 'bg-gradient-to-br from-blue-400 to-purple-500'
            }`}
          >
            {plan.type === 'premium' ? (
              <Crown className="w-10 h-10 text-white" />
            ) : (
              <Star className="w-10 h-10 text-white" />
            )}
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {plan.name || (plan.type === 'premium' ? 'Premium' : 'Basic')}
          </h3>
          
          <p className="text-gray-600">
            {plan.description || (plan.type === 'premium' ? 'Ultimate travel experience' : 'Essential travel features')}
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-8">
          <div className="flex items-end justify-center space-x-1">
            <span className="text-4xl font-bold text-gray-800">
              ₹{plan.price?.toLocaleString() || (plan.type === 'premium' ? '2,999' : '999')}
            </span>
            <span className="text-gray-600 mb-1">
              /{plan.duration || 'month'}
            </span>
          </div>
          
          {plan.originalPrice && (
            <div className="text-gray-500 line-through text-lg">
              ₹{plan.originalPrice.toLocaleString()}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index + 0.4 }}
              className="flex items-center space-x-3"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect && onSelect(plan)}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            isPopular
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-200 hover:border-gray-300'
          }`}
        >
          {plan.buttonText || 'Choose Plan'}
        </motion.button>
      </div>
    </motion.div>
  );
};

const SubscriptionPlans = ({ plans = [], onPlanSelect }) => {
  // Default plans if none provided
  const defaultPlans = [
    {
      id: 'basic',
      type: 'basic',
      name: 'Explorer',
      description: 'Perfect for occasional travelers',
      price: 999,
      originalPrice: 1499,
      duration: 'month',
      features: [
        'Access to 50+ destinations',
        'Standard booking support',
        'Basic travel insurance',
        'Email customer support',
        'Mobile app access'
      ],
      buttonText: 'Start Exploring'
    },
    {
      id: 'premium',
      type: 'premium',
      name: 'Royal Traveler',
      description: 'Ultimate luxury travel experience',
      price: 2999,
      originalPrice: 4499,
      duration: 'month',
      features: [
        'Access to ALL destinations',
        'Priority booking & upgrades',
        'Comprehensive travel insurance',
        '24/7 premium support',
        'Exclusive luxury stays',
        'Personal travel consultant',
        'Free cancellation',
        'VIP airport services'
      ],
      buttonText: 'Go Royal'
    }
  ];

  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Section Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Choose Your Travel Style
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Unlock exclusive destinations and premium travel experiences with our 
          carefully crafted subscription plans.
        </p>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {displayPlans.map((plan, index) => (
          <SubscriptionCard
            key={plan.id}
            plan={plan}
            isPopular={plan.type === 'premium'}
            onSelect={onPlanSelect}
          />
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-16 space-y-4"
      >
        <p className="text-gray-600">
          All plans include our satisfaction guarantee and can be cancelled anytime.
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>No hidden fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-600" />
            <span>Secure payments</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionPlans;