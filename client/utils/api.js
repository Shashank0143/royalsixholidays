import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Remove invalid token
      Cookies.remove('token');
      
      // Redirect to login only if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/auth/login';
      }
    }
    
    // Handle subscription required error
    if (error.response?.status === 403 && error.response?.data?.subscriptionRequired) {
      // Redirect to subscription page
      if (typeof window !== 'undefined') {
        window.location.href = '/subscription';
      }
    }

    return Promise.reject(error);
  }
);

export default api;