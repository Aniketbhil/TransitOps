import api from './api';

export const driverApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/drivers', { params });
    return response.data;
  },
  // ... keep the rest of the functions unchanged
  getAvailable: async () => {
    const response = await api.get('/drivers/available');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },
  create: async (driverData) => {
    const response = await api.post('/drivers', driverData);
    return response.data;
  },
  update: async (id, driverData) => {
    const response = await api.put(`/drivers/${id}`, driverData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  }
};