import api from './axiosConfig';

export const searchItems = (params) => api.get('/search', { params });
export const getCategories = () => api.get('/search/categories');
