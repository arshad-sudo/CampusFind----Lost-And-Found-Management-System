import api from './axiosConfig';

export const getNotifications = (page = 0, size = 10) => api.get(`/notifications?page=${page}&size=${size}`);
export const getUnreadCount = () => api.get('/notifications/unread-count');
export const markAsRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllAsRead = () => api.put('/notifications/read-all');
