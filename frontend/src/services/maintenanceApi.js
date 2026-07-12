import api from './api';

export const maintenanceApi = {
  getAll: async () => {
    const response = await api.get('/maintenance');
    return response.data;
  },

  create: async (maintenanceData) => {
    const response = await api.post('/maintenance', maintenanceData);
    return response.data;
  },

  complete: async (id) => {
    const response = await api.post(`/maintenance/${id}/complete`);
    return response.data;
  }
};