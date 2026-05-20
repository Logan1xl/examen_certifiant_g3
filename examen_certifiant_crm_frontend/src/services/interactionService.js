import api from './api';

export const interactionService = {
  list(page = 0, size = 10) {
    return api.get('/interactions', { params: { page, size } });
  },

  create(data) {
    return api.post('/interactions', data);
  },

  close(id) {
    return api.patch(`/interactions/${id}/close`);
  },

  getByClient(clientId) {
    return api.get('/interactions/by-client', { params: { clientId } });
  },
};

export default interactionService;
