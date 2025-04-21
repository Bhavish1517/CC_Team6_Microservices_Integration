import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTutorials = () => api.get('/tutorials');
export const getTutorial = (id) => api.get(`/tutorials/${id}`);
export const createTutorial = (tutorial) => api.post('/tutorials', tutorial);
export const updateTutorial = (id, tutorial) => api.put(`/tutorials/${id}`, tutorial);
export const deleteTutorial = (id) => api.delete(`/tutorials/${id}`); 