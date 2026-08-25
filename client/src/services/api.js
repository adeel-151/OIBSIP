import axios from 'axios';
import useAuthStore from '../store/authStore';

let baseURL = import.meta.env.VITE_API_URL || 'https://oibsip-xnyz.onrender.com/api';
// Remove trailing slash if exists
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}
// Append /api if missing
if (!baseURL.endsWith('/api')) {
  baseURL = `${baseURL}/api`;
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 globally: dispatch a logout event and redirect
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login?redirect=' + window.location.pathname;
    }
    return Promise.reject(error);
  }
);

export default api;