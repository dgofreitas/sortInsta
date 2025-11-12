import api from './api';

const raffleService = {
  async createRaffle(data) {
    const response = await api.post('/raffle', data);
    return response.data.data;
  },

  async getRaffles(page = 1, limit = 10) {
    const response = await api.get('/raffle', {
      params: { page, limit },
    });
    return response.data.data;
  },

  async getRaffle(id) {
    const response = await api.get(`/raffle/${id}`);
    return response.data.data;
  },

  async deleteRaffle(id) {
    const response = await api.delete(`/raffle/${id}`);
    return response.data;
  },
};

export default raffleService;
