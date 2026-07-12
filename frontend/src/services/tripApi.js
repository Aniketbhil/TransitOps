import api from './api';

export const tripApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/trips', { params });
    return response.data;
  },
  // ... keep the rest of the functions unchanged
  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  create: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },
  dispatch: async (id) => {
    const response = await api.post(`/trips/${id}/dispatch`);
    return response.data;
  },
  complete: async (id, completeData) => {
    const response = await api.post(`/trips/${id}/complete`, completeData);
    return response.data;
  },
  cancel: async (id) => {
    const response = await api.post(`/trips/${id}/cancel`);
    return response.data;
  }
};