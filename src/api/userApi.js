import axios from 'axios';

const API_URL = 'https://financewebbackend.onrender.com/api/auth';

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
  getAll: () => apiClient.get('https://financewebbackend.onrender.com/budgets'),
  create: (budget) => apiClient.post('https://financewebbackend.onrender.com/budgets', budget),
  update: (id, budget) => apiClient.put(`https://financewebbackend.onrender.com/budgets/${id}`, budget),
  delete: (id) => apiClient.delete(`https://financewebbackend.onrender.com/budgets/${id}`),
  updateSpending: (id, amount) => apiClient.patch(`https://financewebbackend.onrender.com/budgets/${id}/spending`, { amount })
};

// Transaction API calls
export const transactionAPI = {
  getAll: () => apiClient.get('https://financewebbackend.onrender.com/transactions'),
  create: (transaction) => apiClient.post('https://financewebbackend.onrender.com/transactions', transaction),
  update: (id, transaction) => apiClient.put(`https://financewebbackend.onrender.com/transactions/${id}`, transaction),
  delete: (id) => apiClient.delete(`https://financewebbackend.onrender.com/transactions/${id}`)
};

// Todo API calls
export const todoAPI = {
  getAll: () => apiClient.get('https://financewebbackend.onrender.com/todos'),
  create: (todo) => apiClient.post('https://financewebbackend.onrender.com/todos', todo),
  update: (id, todo) => apiClient.put(`https://financewebbackend.onrender.com/todos/${id}`, todo),
  delete: (id) => apiClient.delete(`https://financewebbackend.onrender.com/todos/${id}`),
  toggle: (id) => apiClient.patch(`https://financewebbackend.onrender.com/todos/${id}/toggle`)
};

// Financial Goals API calls
export const goalAPI = {
  getAll: () => apiClient.get('https://financewebbackend.onrender.com/goals'),
  create: (goal) => apiClient.post('https://financewebbackend.onrender.com/goals', goal),
  update: (id, goal) => apiClient.put(`https://financewebbackend.onrender.com/goals/${id}`, goal),
  delete: (id) => apiClient.delete(`https://financewebbackend.onrender.com/goals/${id}`)
};

export const getCurrentUser = () => userClient.get('https://financewebbackend.onrender.com/user/me');
export const updateUser = (userData) => userClient.put('https://financewebbackend.onrender.com/user/me', userData);