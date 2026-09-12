import api from './axiosConfig';

export const getDashboardStats = () => api.get('/admin/dashboard/stats');
export const getMonthlyStats = () => api.get('/admin/dashboard/monthly-stats');
export const getCategoryStats = () => api.get('/admin/dashboard/category-stats');
export const getRecentActivities = () => api.get('/admin/dashboard/recent-activities');

export const getAllUsers = (page = 0, size = 10, search = '') => api.get(`/admin/users?page=${page}&size=${size}&search=${search}`);
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const activateUser = (id) => api.put(`/admin/users/${id}/activate`);
export const deactivateUser = (id) => api.put(`/admin/users/${id}/deactivate`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export const getAllLostItemsAdmin = (page = 0, size = 10) => api.get(`/admin/lost-items?page=${page}&size=${size}`);
export const getAllFoundItemsAdmin = (page = 0, size = 10) => api.get(`/admin/found-items?page=${page}&size=${size}`);

export const approveLostItem = (id) => api.put(`/admin/lost-items/${id}/approve`);
export const approveFoundItem = (id) => api.put(`/admin/found-items/${id}/approve`);
export const rejectItem = (id, type) => api.put(`/admin/${type}-items/${id}/reject`);
export const deleteItem = (id, type) => api.delete(`/admin/${type}-items/${id}`);
export const updateItemStatus = (id, type, status) => api.put(`/admin/${type}-items/${id}/status?status=${status}`);

export const getAllClaims = (page = 0, size = 10) => api.get(`/admin/claims?page=${page}&size=${size}`);
export const approveClaim = (id) => api.put(`/admin/claims/${id}/approve`);
export const rejectClaim = (id, notes) => api.put(`/admin/claims/${id}/reject?adminNotes=${encodeURIComponent(notes || '')}`);
export const markClaimReturned = (id) => api.put(`/admin/claims/${id}/return`);

export const generateReport = (type, format, dateFrom, dateTo) => 
  api.get(`/admin/reports/generate?type=${type}&format=${format}&dateFrom=${dateFrom || ''}&dateTo=${dateTo || ''}`, { responseType: 'blob' });

export const getAllFeedback = (page = 0, size = 10) => api.get(`/admin/feedback?page=${page}&size=${size}`);
