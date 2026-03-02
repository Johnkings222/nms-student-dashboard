import axios from 'axios';

// Base URL for the API
// Using relative URL to leverage Vite proxy and avoid CORS issues in development
// In production, uses environment variable or falls back to default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? 'https://nms-src9.onrender.com' : '');

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    // BUT: Don't auto-redirect for auth endpoints (login, register, etc.)
    const isAuthEndpoint = error.config?.url?.includes('/login') ||
                          error.config?.url?.includes('/register') ||
                          error.config?.url?.includes('/forgot-password') ||
                          error.config?.url?.includes('/reset-password');

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
