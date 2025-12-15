import axios from 'axios';

// Set default base URL for API calls
if (typeof window !== 'undefined') {
  // Client-side
  axios.defaults.baseURL = 'http://localhost:5000';
} else {
  // Server-side
  axios.defaults.baseURL = 'http://localhost:5000';
}

// Request interceptor to add auth token
axios.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;