import api from './api';

export const restaurantService = {
  list(page = 0, size = 10) {
    return api.get('/restaurants', { params: { page, size } });
  },

  getById(id) {
    return api.get(`/restaurants/${id}`);
  },

  getStats() {
    return api.get('/restaurants/stats');
  },
};

export default restaurantService;
