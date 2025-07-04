import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const userClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

userClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, err => Promise.reject(err));

export const getCurrentUser = () => userClient.get('/user/me');
export const updateUser = (userData) => userClient.put('/user/me', userData);