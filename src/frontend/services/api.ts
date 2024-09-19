import axios, { AxiosInstance } from 'axios';
import { store } from '../store';
import { RootState } from '../store';
import { refreshToken } from '../store/actions/authActions';

// Define the base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Create and configure the Axios instance
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor for authentication
  instance.interceptors.request.use(
    (config) => {
      const state = store.getState() as RootState;
      const token = state.auth.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling and token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await handleApiError(error);
          return instance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Handle API errors and attempt to refresh the token if necessary
const handleApiError = async (error: any): Promise<any> => {
  if (error.response && error.response.status === 401) {
    try {
      await store.dispatch(refreshToken());
      return Promise.resolve();
    } catch (refreshError) {
      // Token refresh failed, logout user or handle accordingly
      // This part should be implemented based on your authentication flow
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};

// Create the API instance
const api = createApiInstance();

export default api;

// Human tasks (to be implemented):
// TODO: Implement rate limiting handling to prevent API abuse
// TODO: Add request caching mechanism to reduce unnecessary API calls
// TODO: Implement request queuing for offline support
// TODO: Add comprehensive error logging and reporting
// TODO: Implement API versioning support
// TODO: Add support for cancelling ongoing requests
// TODO: Implement request retrying with exponential backoff for failed requests
// TODO: Add support for file uploads and downloads
// TODO: Implement API mocking for development and testing purposes