import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sistema-pet.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const authApi = {
  login: async (email, senha) => {
    const response = await api.post('/login', { email, senha });
    return response.data;
  }
};

export const tutoresApi = {
  getAll: async () => {
    const response = await api.get('/tutores');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tutores/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/tutores', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/tutores/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/tutores/${id}`);
    return response.data;
  }
};

export const petsApi = {
  getAll: async () => {
    const response = await api.get('/pets');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/pets', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/pets/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/pets/${id}`);
    return response.data;
  }
};

export const funcionariosApi = {
  getAll: async () => {
    const response = await api.get('/funcionarios');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/funcionarios/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/funcionarios', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/funcionarios/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/funcionarios/${id}`);
    return response.data;
  }
};

export default api;
