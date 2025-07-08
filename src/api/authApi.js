import axios from 'axios';

const API_URL = 'https://financewebbackend.onrender.com/api/auth';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json', // ✅ Ensure content type is set
  },
});

export const signup = (userData) => apiClient.post('https://financewebbackend.onrender.com/signup', userData);
export const login = (userData) => apiClient.post('https://financewebbackend.onrender.com/login', userData); // ✅ Using relative path
export const forgotPassword = (emailData) => apiClient.post('https://financewebbackend.onrender.com/forgot-password', emailData);