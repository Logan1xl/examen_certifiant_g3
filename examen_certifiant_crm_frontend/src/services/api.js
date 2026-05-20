import axios from 'axios';

// URL de base résolue : si VITE_API_URL est définie, on la nettoie pour adapter les endpoints
let API_URL = import.meta.env.VITE_API_URL || '';

if (API_URL.endsWith('/api/v1')) {
  API_URL = API_URL.replace('/api/v1', '');
} else if (API_URL.endsWith('/api')) {
  API_URL = API_URL.replace('/api', '');
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête : attache le token JWT et injecte /api si non présent
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    // Si la requête ne concerne pas l'auth, et ne contient pas /api, on injecte /api
    if (!url.startsWith('/auth/') && !url.startsWith('auth/') && !url.startsWith('/api/') && !url.startsWith('api/')) {
      config.url = `/api${url.startsWith('/') ? '' : '/'}${url}`;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : gère les déconnexions sur erreur 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
