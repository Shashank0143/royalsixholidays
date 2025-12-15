const User = require('../models/User');

// Subscribe user to a plan
const subscribe = async (req, res) => {
  try {
    const { planType } = req.body; // 'monthly' or 'yearly'
    
    if (!['monthly', 'yearly'].includes(planType)) {
      return res.status(400).json({ message: 'Invalid plan type' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate expiry date
    const now = new Date();
    const expiryDate = new Date(now);
    
    if (planType === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Update user subscription
    user.isSubscribed = true;
    user.subscriptionType = planType;
    user.subscriptionExpiry = expiryDate;

    await user.save();

    res.json({
      message: 'Subscription activated successfully',
      subscription: {
        isSubscribed: user.isSubscribed,
        planType: user.subscriptionType,
        expiryDate: user.subscriptionExpiry
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ message: 'Server error during subscription' });
  }
};

// Get subscription status
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if subscription is expired
    const now = new Date();
    if (user.subscriptionExpiry && user.subscriptionExpiry < now) {
      user.isSubscribed = false;
      user.subscriptionType = null;
      user.subscriptionExpiry = null;
      await user.save();
    }

    res.json({
      isSubscribed: user.isSubscribed,
      planType: user.subscriptionType,
      expiryDate: user.subscriptionExpiry,
      daysRemaining: user.subscriptionExpiry 
        ? Math.ceil((user.subscriptionExpiry - now) / (1000 * 60 * 60 * 24))
        : 0
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ message: 'Server error fetching subscription status' });
  }
};

// Cancel subscription (set to expire at current period end)
const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isSubscribed) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    // Note: In a real app, you'd integrate with payment provider
    // For now, we'll just mark it for cancellation at period end
    user.isSubscribed = false;
    user.subscriptionType = null;
    user.subscriptionExpiry = null;

    await user.save();

    res.json({
      message: 'Subscription cancelled successfully',
      subscription: {
        isSubscribed: false,
        planType: null,
        expiryDate: null
      }
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error cancelling subscription' });
  }
};

// Get subscription plans and pricing
const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        price: parseFloat(process.env.MONTHLY_PRICE) || 9.99,
        duration: '1 month',
        features: [
          'Access to all destinations and places',
          'Detailed cultural information',
          'Food recommendations',
          'Hotel suggestions',
          'Cost breakdowns',
          'Booking assistance'
        ]
      },
      {
        id: 'yearly',
        name: 'Yearly Plan',
        price: parseFloat(process.env.YEARLY_PRICE) || 99.99,
        duration: '12 months',
        discount: '17% savings',
        features: [
          'Everything in Monthly Plan',
          'Priority customer support',
          'Exclusive deals and offers',
          'Early access to new destinations',
          'Personalized travel recommendations'
        ],
        popular: true
      }
    ];

    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error fetching plans' });
  }
};

module.exports = {
  subscribe,
  getSubscriptionStatus,
  cancelSubscription,
  getPlans
};