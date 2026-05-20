import api from './api';

export const commandeService = {
  getAll(page = 0, size = 10) {
    return api.get('/commandes', { params: { page, size } });
  },

  getById(id) {
    return api.get(`/commandes/${id}`);
  },

  create(data) {
    return api.post('/commandes', data);
  },

  updateStatut(id, statut) {
    return api.patch(`/commandes/${id}/statut`, { statut });
  },

  getByRestaurant(restaurantId, page = 0, size = 10) {
    return api.get('/commandes/by-restaurant', {
      params: { restaurantId, page, size },
    });
  },

  getStats() {
    return api.get('/commandes/stats');
  },
};

export default commandeService;
