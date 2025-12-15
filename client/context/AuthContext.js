import { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  subscription: {
    isSubscribed: false,
    planType: null,
    expiryDate: null,
    daysRemaining: 0
  }
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_SUBSCRIPTION: 'UPDATE_SUBSCRIPTION',
  CLEAR_AUTH: 'CLEAR_AUTH'
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        subscription: {
          isSubscribed: action.payload.user.isSubscribed,
          planType: action.payload.user.subscriptionType,
          expiryDate: action.payload.user.subscriptionExpiry,
          daysRemaining: action.payload.user.subscriptionExpiry ? 
            Math.ceil((new Date(action.payload.user.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)) : 0
        }
      };
    
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        subscription: {
          ...state.subscription,
          isSubscribed: action.payload.isSubscribed !== undefined ? action.payload.isSubscribed : state.subscription.isSubscribed,
          planType: action.payload.subscriptionType !== undefined ? action.payload.subscriptionType : state.subscription.planType,
          expiryDate: action.payload.subscriptionExpiry !== undefined ? action.payload.subscriptionExpiry : state.subscription.expiryDate
        }
      };
    
    case AUTH_ACTIONS.UPDATE_SUBSCRIPTION:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          ...action.payload
        }
      };
    
    case AUTH_ACTIONS.LOGOUT:
    case AUTH_ACTIONS.CLEAR_AUTH:
      return {
        ...initialState,
        isLoading: false
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set axios default headers
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      // Verify token and get user data
      const response = await axios.post('/api/auth/verify-token');
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.data.user,
          token
        }
      });

      // Get subscription status
      await fetchSubscriptionStatus();
    } catch (error) {
      console.error('Auth initialization error:', error);
      Cookies.remove('token');
      dispatch({ type: AUTH_ACTIONS.CLEAR_AUTH });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post('/api/auth/login', { email, password });
      
      const { token, user } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 30, secure: true, sameSite: 'strict' });
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      console.log('Sending registration data:', userData);
      const response = await axios.post('/api/auth/register', userData);
      console.log('Registration response:', response.data);
      
      const { token, user } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 30, secure: false, sameSite: 'lax' });
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      toast.success('Registration successful!');
      return { success: true, user };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      console.error('Registration error:', error);
      
      let message = 'Registration failed';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        message = error.response.data.errors.map(err => err.msg).join(', ');
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const googleLogin = async (credential) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post('/api/auth/google', { credential });
      
      const { token, user } = response.data;
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 30, secure: true, sameSite: 'strict' });
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      toast.success('Google login successful!');
      return { success: true, user };
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: response.data.user
      });

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await axios.get('/api/subscription/status');
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_SUBSCRIPTION,
        payload: response.data
      });

      return response.data;
    } catch (error) {
      console.error('Fetch subscription status error:', error);
      return null;
    }
  };

  const subscribe = async (planType) => {
    try {
      const response = await axios.post('/api/subscription/subscribe', { planType });
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_SUBSCRIPTION,
        payload: response.data.subscription
      });

      toast.success('Subscription activated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Subscription failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = await axios.delete('/api/subscription/cancel');
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_SUBSCRIPTION,
        payload: response.data.subscription
      });

      toast.success('Subscription cancelled successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Cancellation failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    ...state,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    fetchSubscriptionStatus,
    subscribe,
    cancelSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;