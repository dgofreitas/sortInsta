import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_BASE_URL.replace('/api', '');

const authService = {
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data;
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
