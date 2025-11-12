import api from './api';

const instagramService = {
  async getPosts(limit = 25) {
    const response = await api.get('/instagram/posts', {
      params: { limit },
    });
    return response.data.data;
  },

  async getPost(postId) {
    const response = await api.get(`/instagram/posts/${postId}`);
    return response.data.data;
  },

  async getPostComments(postId) {
    const response = await api.get(`/instagram/posts/${postId}/comments`);
    return response.data.data;
  },

  async setBusinessAccount(facebookPageId) {
    const response = await api.post('/instagram/business-account', {
      facebookPageId,
    });
    return response.data.data;
  },
};

export default instagramService;
