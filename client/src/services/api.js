import axios from 'axios';

// ตรวจสอบ baseURL ตามสภาพแวดล้อม
const getBaseURL = () => {
  const hostname = window.location.hostname;
  const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
  
  if (isDevelopment) {
    // ในการพัฒนา ใช้ proxy ผ่าน /api
    return '/api';
  }
  
  // ในการ production ใช้ port 5000 โดยตรง
  const port = window.location.port;
  return `http://${hostname}:5000/api`;
};

const API = axios.create({
  baseURL: getBaseURL()
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ถ้า token หมดอายุ ให้ logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const hotelService = {
  getAll: () => API.get('/hotels'),
  getById: (id) => API.get(`/hotels/${id}`),
  search: (query) => API.get(`/hotels/search?query=${query}`),
  filter: (params) => API.get('/hotels/filter', { params }),
  incrementViews: (id) => API.post(`/hotels/${id}/view`),
};

export const reviewService = {
  create: (data) => API.post('/reviews', data),
  getByHotel: (hotelId) => API.get(`/reviews/hotel/${hotelId}`),
  getUserReviews: () => API.get('/reviews/my-reviews'),
  delete: (reviewId) => API.delete(`/reviews/${reviewId}`),
};

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getCurrentUser: () => API.get('/auth/me'),
};

export const adminService = {
  addHotel: (data) => API.post('/admin/hotels', data),
  updateHotel: (id, data) => API.put(`/admin/hotels/${id}`, data),
  deleteHotel: (id) => API.delete(`/admin/hotels/${id}`),
  updateUserUsername: (userId, data) => API.put(`/admin/users/${userId}/username`, data),
  updateUserPassword: (userId, data) => API.put(`/admin/users/${userId}/password`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  createUser: (data) => API.post('/admin/users', data),
};

export const favoriteService = {
  add: (hotelId) => API.post('/favorites', { hotelId }),
  remove: (hotelId) => API.delete(`/favorites/${hotelId}`),
  getAll: () => API.get('/favorites'),
};

export const announcementService = {
  getActive: () => API.get('/announcements'),
  getAll: () => API.get('/announcements/all'),
  create: (data) => API.post('/announcements', data),
  update: (id, data) => API.put(`/announcements/${id}`, data),
  delete: (id) => API.delete(`/announcements/${id}`),
};

export const activityLogService = {
  getAll: (page = 1, limit = 15) => API.get(`/activity-logs?page=${page}&limit=${limit}`),
  getByAction: (action, page = 1, limit = 15) => API.get(`/activity-logs/by-action/${action}?page=${page}&limit=${limit}`),
  getByUser: (userId, page = 1, limit = 15) => API.get(`/activity-logs/by-user/${userId}?page=${page}&limit=${limit}`),
  getStats: () => API.get('/activity-logs/stats'),
  deleteOldLogs: () => API.delete('/activity-logs/cleanup'),
};

export default API;
