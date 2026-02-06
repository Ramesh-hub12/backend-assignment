
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});



export const login = (formData) => API.post('/auth/login', formData);

export const register = (formData) => API.post('/auth/register', formData);

export const getTasks = () => API.get('/tasks');

export const createTask = (taskData) => API.post('/tasks', taskData);

export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;