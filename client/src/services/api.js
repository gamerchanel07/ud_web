import axios from 'axios';

// ตรวจสอบ baseURL ตามสภาพแวดล้อม
const getBaseURL = () => {
  // ถ้าเป็น localhost ใช้ /api (ผ่าน proxy)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '/api';
  }
  // ถ้าเป็น IP address อื่น ให้เชื่อมต่อ backend โดยตรง
  return `http://${window.location.hostname}:5000/api`;
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

export const hotelService = {
  getAll: () => API.get('/hotels'),
  getById: (id) => API.get(`/hotels/${id}`),
  search: (query) => API.get(`/hotels/search?query=${query}`),
  filter: (params) => API.get('/hotels/filter', { params }),
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
