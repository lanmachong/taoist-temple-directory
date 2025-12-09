import axios from 'axios';

// 生产环境使用相对路径，开发环境使用完整 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api'
);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 道观 API
export const templeAPI = {
  getList: (params) => api.get('/temples', { params }),
  getDetail: (id) => api.get(`/temples/${id}`),
  create: (data) => api.post('/temples', data),
  update: (id, data) => api.put(`/temples/${id}`, data),
  delete: (id) => api.delete(`/temples/${id}`)
};

// 认证 API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout')
};

export default api;
