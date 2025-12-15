const subscriptionMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.user.isSubscribed) {
      return res.status(403).json({ 
        message: 'Subscription required to access this content',
        subscriptionRequired: true 
      });
    }

    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = subscriptionMiddleware;