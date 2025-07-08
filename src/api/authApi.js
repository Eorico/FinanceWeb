import axios from 'axios';

const API_URL = 'https://finance-web-steel.vercel.app/api/auth';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // ✅ Ensure content type is set
  },
});

export const signup = (userData) => apiClient.post('/signup', userData);
export const login = (userData) => apiClient.post('/login', userData); // ✅ Using relative path
export const forgotPassword = (emailData) => apiClient.post('/forgot-password', emailData);