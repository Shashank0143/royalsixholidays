import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  Plus,
  Trash2,
  Camera,
  Utensils,
  Car,
  Plane,
  Train,
  Hotel,
  Mountain,
  Sun,
  Star,
  ChevronLeft,
  ChevronRight,
  Save,
  Share2,
  Download,
  Edit3
} from 'lucide-react';

const TripPlannerPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: { adults: 2, children: 0 },
    budget: { min: 20000, max: 50000 },
    preferences: [],
    itinerary: []
  });

  const [selectedDay, setSelectedDay] = useState(0);
  const [draggedActivity, setDraggedActivity] = useState(null);

  const steps = [
    { title: 'Destination', icon: MapPin },
    { title: 'Dates & Travelers', icon: Calendar },
    { title: 'Preferences', icon: Star },
    { title: 'Itinerary', icon: Clock },
    { title: 'Review', icon: Save }
  ];

  const preferenceOptions = [
    { id: 'adventure', label: 'Adventure Sports', icon: Mountain, color: 'bg-red-100 text-red-600' },
    { id: 'culture', label: 'Cultural Tours', icon: Camera, color: 'bg-purple-100 text-purple-600' },
    { id: 'food', label: 'Food & Cuisine', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
    { id: 'relaxation', label: 'Relaxation', icon: Sun, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'nature', label: 'Nature & Wildlife', icon: Mountain, color: 'bg-green-100 text-green-600' },
    { id: 'shopping', label: 'Shopping', icon: Star, color: 'bg-pink-100 text-pink-600' }
  ];

  const activityTypes = [
    { type: 'sightseeing', label: 'Sightseeing', icon: Camera, color: 'bg-blue-500' },
    { type: 'food', label: 'Dining', icon: Utensils, color: 'bg-orange-500' },
    { type: 'transport', label: 'Transport', icon: Car, color: 'bg-green-500' },
    { type: 'accommodation', label: 'Stay', icon: Hotel, color: 'bg-purple-500' },
    { type: 'activity', label: 'Activity', icon: Mountain, color: 'bg-red-500' }
  ];

  const destinations = [
    { name: 'Jaipur, Rajasthan', image: '/images/jaipur.jpg', description: 'Pink City of India' },
    { name: 'Kerala Backwaters', image: '/images/kerala.jpg', description: 'God\'s Own Country' },
    { name: 'Goa Beaches', image: '/images/goa.jpg', description: 'Beach Paradise' },
    { name: 'Himachal Pradesh', image: '/images/himachal.jpg', description: 'Hill Station Beauty' },
    { name: 'Agra, Uttar Pradesh', image: '/images/agra.jpg', description: 'City of Taj Mahal' }
  ];

  useEffect(() => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const newItinerary = Array.from({ length: days }, (_, index) => ({
        day: index + 1,
        date: new Date(start.getTime() + (index * 24 * 60 * 60 * 1000)).toDateString(),
        activities: []
      }));
      
      setTripData(prev => ({ ...prev, itinerary: newItinerary }));
    }
  }, [tripData.startDate, tripData.endDate]);

  const handlePreferenceToggle = (prefId) => {
    setTripData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(prefId)
        ? prev.preferences.filter(id => id !== prefId)
        : [...prev.preferences, prefId]
    }));
  };

  const addActivity = (dayIndex, activityType) => {
    const newActivity = {
      id: Date.now(),
      type: activityType,
      title: `New ${activityTypes.find(t => t.type === activityType)?.label}`,
      description: 'Add description...',
      time: '09:00',
      duration: '2 hours',
      location: ''
    };

    setTripData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      )
    }));
  };

  const removeActivity = (dayIndex, activityId) => {
    setTripData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex
          ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
          : day
      )
    }));
  };

  const updateActivity = (dayIndex, activityId, field, value) => {
    setTripData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              activities: day.activities.map(activity =>
                activity.id === activityId
                  ? { ...activity, [field]: value }
                  : activity
              )
            }
          : day
      )
    }));
  };

  const renderDestinationStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Where would you like to go?
        </label>
        <Input
          type="text"
          placeholder="Search destinations..."
          value={tripData.destination}
          onChange={(e) => setTripData(prev => ({ ...prev, destination: e.target.value }))}
          className="mb-4"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {destinations.map((dest, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTripData(prev => ({ ...prev, destination: dest.name }))}
            className={`relative overflow-hidden rounded-xl cursor-pointer border-2 transition-all ${
              tripData.destination === dest.name
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">{dest.name}</h3>
              <p className="text-gray-600 text-sm">{dest.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderDatesStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <Input
            type="date"
            value={tripData.startDate}
            onChange={(e) => setTripData(prev => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <Input
            type="date"
            value={tripData.endDate}
            onChange={(e) => setTripData(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Number of Travelers
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm text-gray-600 mb-2">Adults</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTripData(prev => ({
                  ...prev,
                  travelers: { ...prev.travelers, adults: Math.max(1, prev.travelers.adults - 1) }
                }))}
                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-lg font-semibold">{tripData.travelers.adults}</span>
              <button
                onClick={() => setTripData(prev => ({
                  ...prev,
                  travelers: { ...prev.travelers, adults: prev.travelers.adults + 1 }
                }))}
                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm text-gray-600 mb-2">Children</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTripData(prev => ({
                  ...prev,
                  travelers: { ...prev.travelers, children: Math.max(0, prev.travelers.children - 1) }
                }))}
                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-lg font-semibold">{tripData.travelers.children}</span>
              <button
                onClick={() => setTripData(prev => ({
                  ...prev,
                  travelers: { ...prev.travelers, children: prev.travelers.children + 1 }
                }))}
                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Budget Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Minimum</label>
            <Input
              type="number"
              value={tripData.budget.min}
              onChange={(e) => setTripData(prev => ({
                ...prev,
                budget: { ...prev.budget, min: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Maximum</label>
            <Input
              type="number"
              value={tripData.budget.max}
              onChange={(e) => setTripData(prev => ({
                ...prev,
                budget: { ...prev.budget, max: parseInt(e.target.value) || 0 }
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What are you interested in?
        </h3>
        <p className="text-gray-600 mb-6">
          Select your travel preferences to customize your itinerary
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {preferenceOptions.map((pref) => (
          <motion.div
            key={pref.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePreferenceToggle(pref.id)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              tripData.preferences.includes(pref.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${pref.color}`}>
              <pref.icon className="w-6 h-6" />
            </div>
            <h4 className="font-medium text-gray-900">{pref.label}</h4>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderItineraryStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Plan Your Itinerary
        </h3>
        <div className="text-sm text-gray-600">
          {tripData.itinerary.length} days planned
        </div>
      </div>

      {tripData.itinerary.length > 0 && (
        <>
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tripData.itinerary.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedDay === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Day {day.day}
              </button>
            ))}
          </div>

          {/* Selected Day Activities */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  Day {tripData.itinerary[selectedDay]?.day}
                </h4>
                <p className="text-gray-600">
                  {tripData.itinerary[selectedDay]?.date}
                </p>
              </div>
              
              {/* Add Activity Buttons */}
              <div className="flex gap-2 flex-wrap">
                {activityTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => addActivity(selectedDay, type.type)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium text-white ${type.color}`}
                  >
                    <type.icon className="w-3 h-3" />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Activities List */}
            <div className="space-y-4">
              {tripData.itinerary[selectedDay]?.activities.map((activity) => (
                <div key={activity.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        activityTypes.find(t => t.type === activity.type)?.color || 'bg-gray-500'
                      }`}>
                        {activityTypes.find(t => t.type === activity.type)?.icon && (
                          <activity.type.icon className="w-4 h-4" />
                        ) || <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <Input
                          value={activity.title}
                          onChange={(e) => updateActivity(selectedDay, activity.id, 'title', e.target.value)}
                          className="font-medium mb-1"
                        />
                        <Input
                          value={activity.description}
                          onChange={(e) => updateActivity(selectedDay, activity.id, 'description', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeActivity(selectedDay, activity.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Time</label>
                      <Input
                        type="time"
                        value={activity.time}
                        onChange={(e) => updateActivity(selectedDay, activity.id, 'time', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Duration</label>
                      <Input
                        value={activity.duration}
                        onChange={(e) => updateActivity(selectedDay, activity.id, 'duration', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Location</label>
                      <Input
                        value={activity.location}
                        onChange={(e) => updateActivity(selectedDay, activity.id, 'location', e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {tripData.itinerary[selectedDay]?.activities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No activities planned for this day</p>
                  <p className="text-sm">Use the buttons above to add activities</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Review Your Trip</h3>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-bold text-gray-900 mb-4">Trip Summary</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Destination</p>
            <p className="font-medium">{tripData.destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Duration</p>
            <p className="font-medium">{tripData.itinerary.length} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Travelers</p>
            <p className="font-medium">
              {tripData.travelers.adults} Adults
              {tripData.travelers.children > 0 && `, ${tripData.travelers.children} Children`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="font-medium">₹{tripData.budget.min.toLocaleString()} - ₹{tripData.budget.max.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-bold text-gray-900 mb-4">Itinerary Overview</h4>
        <div className="space-y-3">
          {tripData.itinerary.map((day, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {day.day}
              </div>
              <div className="flex-1">
                <p className="font-medium">Day {day.day}</p>
                <p className="text-sm text-gray-600">{day.activities.length} activities planned</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button className="flex-1 flex items-center justify-center gap-2">
          <Save className="w-5 h-5" />
          Save Trip Plan
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" />
          Share
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </Button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Trip Planner
            </h1>
            <p className="text-xl text-gray-600">
              Create your perfect itinerary step by step
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                    index <= currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {steps[currentStep].title}
            </h2>
            
            {currentStep === 0 && renderDestinationStep()}
            {currentStep === 1 && renderDatesStep()}
            {currentStep === 2 && renderPreferencesStep()}
            {currentStep === 3 && renderItineraryStep()}
            {currentStep === 4 && renderReviewStep()}
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripPlannerPage;