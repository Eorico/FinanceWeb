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

// Log outgoing requests
userClient.interceptors.request.use(config => {
  console.log('Outgoing request:', config.url, config.data);
  return config;
});

// Log incoming responses
userClient.interceptors.response.use(response => {
  console.log('Response:', response.config.url, response.data);
  return response;
});

// Budget API calls
export const budgetAPI = {
  getAll: () => apiClient.get('/budgets'),
  create: (budget) => apiClient.post('/budgets', budget),
  update: (id, budget) => apiClient.put(`/budgets/${id}`, budget),
  delete: (id) => apiClient.delete(`/budgets/${id}`),
  updateSpending: (id, amount) => apiClient.patch(`/budgets/${id}/spending`, { amount })
};

// Transaction API calls
export const transactionAPI = {
  getAll: () => apiClient.get('/transactions'),
  create: (transaction) => apiClient.post('/transactions', transaction),
  update: (id, transaction) => apiClient.put(`/transactions/${id}`, transaction),
  delete: (id) => apiClient.delete(`/transactions/${id}`)
};

// Todo API calls
export const todoAPI = {
  getAll: () => apiClient.get('/todos'),
  create: (todo) => apiClient.post('/todos', todo),
  update: (id, todo) => apiClient.put(`/todos/${id}`, todo),
  delete: (id) => apiClient.delete(`/todos/${id}`),
  toggle: (id) => apiClient.patch(`/todos/${id}/toggle`)
};

// Financial Goals API calls
export const goalAPI = {
  getAll: () => apiClient.get('/goals'),
  create: (goal) => apiClient.post('/goals', goal),
  update: (id, goal) => apiClient.put(`/goals/${id}`, goal),
  delete: (id) => apiClient.delete(`/goals/${id}`)
};

export const getCurrentUser = () => userClient.get('/user/me');
export const updateUser = (userData) => userClient.put('/user/me', userData);