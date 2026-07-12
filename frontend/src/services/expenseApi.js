import api from './api';

export const expenseApi = {
  // Fuel Endpoints
  getFuelLogs: async () => {
    const response = await api.get('/fuel-logs');
    return response.data;
  },
  createFuelLog: async (data) => {
    const response = await api.post('/fuel-logs', data);
    return response.data;
  },

  // General Expense Endpoints
  getExpenses: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  createExpense: async (data) => {
    const response = await api.post('/expenses', data);
    return response.data;
  }
};