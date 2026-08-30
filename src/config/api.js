import axios from 'axios';

// Environment variable se Backend URL uthayega
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;