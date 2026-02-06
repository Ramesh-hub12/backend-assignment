// import axios from 'axios';

// // Create an instance with the base URL for version 1 of your API
// const API = axios.create({
//   baseURL: 'http://localhost:5000/api/v1',
// });

// // Interceptor: Runs before every request to attach the JWT
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// // --- Authentication Services ---
// export const login = (formData) => API.post('/auth/login', formData);
// export const register = (formData) => API.post('/auth/register', formData);

// // --- Task CRUD Services ---
// export const getTasks = () => API.get('/tasks');
// export const createTask = (taskData) => API.post('/tasks', taskData);
// export const updateTask = (id, updatedData) => API.put(`/tasks/${id}`, updatedData);
// export const deleteTask = (id) => API.delete(`/tasks/${id}`);
import axios from 'axios';

// 1. Define the base URL for your local backend server
const API_URL = 'http://localhost:5000/api/v1';

// 2. Create an Axios instance for cleaner code
const API = axios.create({
  baseURL: API_URL,
});

/**
 * AUTH INTERCEPTOR
 * This automatically adds the JWT token to the "Authorization" header 
 * for every request if the token exists in localStorage.
 */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Authentication Services ---

export const login = (formData) => API.post('/auth/login', formData);

export const register = (formData) => API.post('/auth/register', formData);

// --- Task Management Services ---

export const getTasks = () => API.get('/tasks');

export const createTask = (taskData) => API.post('/tasks', taskData);

/**
 * DELETE TASK
 * Note: Your backend RBAC logic will check if the user is an 'admin' 
 * based on the token sent in the headers.
 */
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;