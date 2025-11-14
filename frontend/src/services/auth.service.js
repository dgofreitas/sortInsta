import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = (API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');

const authService = {
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  async loginWithEmail(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    return user;
  },

  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    const { token, user } = response.data.data;
    localStorage.setItem('token', token);
    return user;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  loginWithGoogle() {
    window.location.href = `${BASE_URL}/api/auth/google`;
  },

  loginWithFacebook() {
    window.location.href = `${BASE_URL}/api/auth/facebook`;
  },

  loginWithInstagram() {
    window.location.href = `${BASE_URL}/api/auth/instagram`;
  },
};

export default authService;
