import api from './api';

export const clientService = {
  getAll(page = 0, size = 10) {
    return api.get('/clients', { params: { page, size } });
  },

  search(keyword, page = 0, size = 10) {
    return api.get('/clients/search', { params: { keyword, page, size } });
  },

  getById(id) {
    return api.get(`/clients/${id}`);
  },

  create(data) {
    return api.post('/clients', data);
  },

  update(id, data) {
    return api.put(`/clients/${id}`, data);
  },

  delete(id) {
    return api.delete(`/clients/${id}`);
  },

  getByVille(ville) {
    return api.get('/clients/by-ville', { params: { ville } });
  },

  getStats() {
    return api.get('/clients/stats');
  },
};

export default clientService;
