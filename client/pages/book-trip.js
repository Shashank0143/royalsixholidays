import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  Info,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookTripPage = () => {
  const router = useRouter();
  const { destinationId, placeId, placeName, destinationName } = router.query;
  const { user, isAuthenticated, subscription } = useAuth();

  const [currentStep, setCurrentStep] = useState(() => {
    // Start at step 0 (destination selection) if no destination provided
    return 1; // Will be updated in useEffect
  });
  const [isLoading, setIsLoading] = useState(false);
  const [destination, setDestination] = useState(null);
  const [place, setPlace] = useState(null);

  const [formData, setFormData] = useState({
    // Step 0: Destination Selection (if not provided)
    selectedDestination: null,
    
    // Step 1: Travel Details
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    
    // Step 2: Package Selection
    packageType: 'mid-range',
    budget: 0,
    
    // Step 3: Contact Info
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    specialRequests: '',
    
    // Step 4: Payment
    paymentMethod: 'card'
  });

  const [errors, setErrors] = useState({});

  const getSteps = () => {
    const baseSteps = [
      { number: 1, title: 'Travel Details', icon: Calendar },
      { number: 2, title: 'Package', icon: Star },
      { number: 3, title: 'Contact', icon: Users },
      { number: 4, title: 'Payment', icon: CreditCard }
    ];
    
    // If no destination specified, add destination selection as first step
    if (!destinationId && !placeName) {
      return [
        { number: 0, title: 'Destination', icon: MapPin },
        ...baseSteps
      ];
    }
    
    return baseSteps;
  };
  
  const steps = getSteps();

  const packages = {
    budget: {
      name: 'Budget Friendly',
      multiplier: 1,
      description: 'Essential amenities, comfortable stay',
      features: ['Standard hotels', 'Shared transfers', 'Basic meals included']
    },
    'mid-range': {
      name: 'Comfort Plus',
      multiplier: 1.5,
      description: 'Enhanced comfort and experiences',
      features: ['3-4 star hotels', 'Private transfers', 'All meals included', 'Guided tours']
    },
    luxury: {
      name: 'Royal Luxury',
      multiplier: 2.5,
      description: 'Premium experience with exclusive perks',
      features: ['5-star hotels', 'Luxury car transfers', 'Gourmet dining', 'Personal guide', 'Spa access']
    }
  };

  // Popular destinations for selection
  const popularDestinations = [
    { id: 'jaipur-raj', name: 'Jaipur, Rajasthan', basePrice: 4999, image: '🏰', duration: '3-4 days' },
    { id: 'udaipur-raj', name: 'Udaipur, Rajasthan', basePrice: 5999, image: '🏛️', duration: '3-4 days' },
    { id: 'munnar-kerala', name: 'Munnar, Kerala', basePrice: 5499, image: '🌿', duration: '2-4 days' },
    { id: 'goa-beach', name: 'Goa Beaches', basePrice: 3999, image: '🏖️', duration: '3-5 days' },
    { id: 'manali-hp', name: 'Manali, Himachal Pradesh', basePrice: 6999, image: '🏔️', duration: '4-6 days' },
    { id: 'rishikesh-uk', name: 'Rishikesh, Uttarakhand', basePrice: 4499, image: '🧘', duration: '3-4 days' }
  ];

  // Fetch destination and place details
  useEffect(() => {
    if (destinationId && placeId) {
      fetchDetails();
    }
  }, [destinationId, placeId]);

  // Pre-fill destination and user data
  useEffect(() => {
    // Set initial step based on whether destination is provided
    if (!placeName && !destinationName && !destinationId) {
      setCurrentStep(0); // Start with destination selection
    } else {
      setCurrentStep(1); // Start with travel details
      // Pre-fill destination if provided in URL
      setFormData(prev => ({
        ...prev,
        selectedDestination: {
          id: destinationId || 'custom',
          name: `${placeName}, ${destinationName}`,
          basePrice: 5000 // Default price
        }
      }));
    }
    
    // Pre-fill user data
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Calculate budget when relevant fields change
  useEffect(() => {
    calculateBudget();
  }, [formData.startDate, formData.endDate, formData.adults, formData.children, formData.packageType, place]);

  const fetchDetails = async () => {
    try {
      // For demo, use mock data if API fails
      setDestination({ name: destinationName || 'Rajasthan', basePrice: 5000 });
      setPlace({ 
        name: placeName || 'Jaipur', 
        basePrice: 3000,
        images: ['/images/jaipur.jpg'],
        rating: 4.5
      });
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  const calculateBudget = () => {
    if (!formData.startDate || !formData.endDate || !place) return;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (nights <= 0) return;

    const basePrice = (place.basePrice || 3000) * nights;
    const adultCost = basePrice * formData.adults;
    const childCost = basePrice * 0.5 * formData.children;
    const packageMultiplier = packages[formData.packageType]?.multiplier || 1;
    
    let totalBudget = (adultCost + childCost) * packageMultiplier;

    // Apply subscription discount
    if (subscription?.isSubscribed) {
      const discount = subscription.planType === 'premium' ? 0.15 : 
                       subscription.planType === 'elite' ? 0.25 : 0.05;
      totalBudget = totalBudget * (1 - discount);
    }

    setFormData(prev => ({ ...prev, budget: Math.round(totalBudget) }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';
      if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date';
      }
      if (new Date(formData.startDate) < new Date().setHours(0, 0, 0, 0)) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      if (formData.adults < 1) newErrors.adults = 'At least 1 adult is required';
    }

    if (step === 3) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Invalid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDestinationSelect = (destination) => {
    setFormData(prev => ({ ...prev, selectedDestination: destination }));
  };

  const nextStep = () => {
    // Special validation for step 0 (destination selection)
    if (currentStep === 0 && !formData.selectedDestination) {
      setErrors({ destination: 'Please select a destination' });
      return;
    }
    
    if (currentStep === 0 || validateStep(currentStep)) {
      const maxStep = destinationId || placeName ? 4 : 4;
      setCurrentStep(prev => Math.min(prev + 1, maxStep));
    }
  };

  const prevStep = () => {
    const minStep = (destinationId || placeName) ? 1 : 0;
    setCurrentStep(prev => Math.max(prev - 1, minStep));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a trip');
      router.push('/auth/login?redirect=' + router.asPath);
      return;
    }

    if (!validateStep(3)) return;

    setIsLoading(true);

    try {
      const bookingData = {
        destinationId: destinationId || 'demo-destination',
        placeId: placeId || 'demo-place',
        bookingDetails: {
          startDate: formData.startDate,
          endDate: formData.endDate,
          numberOfPeople: {
            adults: formData.adults,
            children: formData.children
          },
          budget: formData.budget,
          packageType: formData.packageType
        },
        contactInfo: {
          phone: formData.phone,
          alternatePhone: formData.alternatePhone,
          specialRequests: formData.specialRequests
        },
        totalAmount: formData.budget
      };

      const response = await axios.post('/api/bookings', bookingData);

      if (response.data) {
        toast.success('Booking created successfully!');
        router.push(`/payment/confirmation?bookingId=${response.data._id}&type=booking`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getNights = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Trip</h1>
            <p className="text-gray-600">
              {placeName || 'Amazing Destination'}, {destinationName || 'India'}
            </p>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
              </div>
              
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center ${
                    step.number <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step.number < currentStep
                        ? 'bg-blue-600 text-white'
                        : step.number === currentStep
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 font-medium hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence mode="wait">
              {/* Step 0: Destination Selection (if no destination provided) */}
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Choose Your Destination
                  </h2>
                  
                  <p className="text-gray-600">Select a destination for your perfect getaway</p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {popularDestinations.map((dest) => (
                      <motion.div
                        key={dest.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDestinationSelect(dest)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.selectedDestination?.id === dest.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{dest.image}</div>
                          <h3 className="font-semibold text-gray-900">{dest.name}</h3>
                          <p className="text-sm text-gray-500">{dest.duration}</p>
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            ₹{dest.basePrice.toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {formData.selectedDestination && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <p className="text-green-800 font-medium">
                        ✓ Selected: {formData.selectedDestination.name}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 1: Travel Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Travel Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.startDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.endDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.endDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  {getNights() > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800">
                        <strong>{getNights()}</strong> nights, <strong>{getNights() + 1}</strong> days
                      </span>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adults (12+ years) *
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="text-xl font-semibold w-8 text-center">{formData.adults}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, adults: Math.min(10, prev.adults + 1) }))}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Children (2-11 years)
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          -
                        </button>
                        <span className="text-xl font-semibold w-8 text-center">{formData.children}</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, children: Math.min(10, prev.children + 1) }))}
                          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Package Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    Select Package
                  </h2>

                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(packages).map(([key, pkg]) => (
                      <div
                        key={key}
                        onClick={() => setFormData(prev => ({ ...prev, packageType: key }))}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          formData.packageType === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                          {formData.packageType === key && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                        <ul className="space-y-1">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-500 flex items-center gap-1">
                              <Check className="w-3 h-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Price Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration</span>
                        <span>{getNights()} nights</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travelers</span>
                        <span>{formData.adults} adults, {formData.children} children</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package</span>
                        <span>{packages[formData.packageType].name}</span>
                      </div>
                      {subscription?.isSubscribed && (
                        <div className="flex justify-between text-green-600">
                          <span>Member Discount</span>
                          <span>-{subscription.planType === 'premium' ? '15' : '5'}%</span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-blue-600">₹{formData.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Info */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Contact Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternate Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Alternate contact number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Any special requirements, dietary restrictions, accessibility needs..."
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Payment & Confirmation
                  </h2>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{placeName || 'Destination'}</p>
                          <p className="text-sm text-gray-500">{destinationName || 'India'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{new Date(formData.startDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                          <p className="text-sm text-gray-500">to {new Date(formData.endDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">{formData.adults} Adults, {formData.children} Children</p>
                          <p className="text-sm text-gray-500">{packages[formData.packageType].name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total Amount</span>
                        <span className="text-blue-600">₹{formData.budget.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
                        { id: 'upi', name: 'UPI', icon: '📱' },
                        { id: 'netbanking', name: 'Net Banking', icon: '🏦' }
                      ].map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.id }))}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all flex items-center gap-3 ${
                            formData.paymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                        >
                          <span className="text-2xl">{method.icon}</span>
                          <span className="font-medium">{method.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="bg-yellow-50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      By proceeding with the payment, you agree to our Terms of Service and Cancellation Policy. 
                      Free cancellation is available up to 48 hours before the trip start date.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={isLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="w-4 h-4" />
                  Pay ₹{formData.budget.toLocaleString()}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default BookTripPage;
