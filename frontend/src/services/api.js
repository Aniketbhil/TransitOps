import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:8000', // Aniket's backend URL
});

// Request Interceptor: Automatically attach the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid/expired, clear storage and kick to login
      localStorage.removeItem('access_token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;