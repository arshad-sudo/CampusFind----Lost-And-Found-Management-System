import api from './axiosConfig';

export const createFoundItem = async (data, images) => {
  const res = await api.post('/found-items', data);
  const createdItem = res?.data || res;
  if (images && images.length > 0 && createdItem?.id) {
    const formData = new FormData();
    images.forEach(img => {
      if (img) formData.append('files', img);
    });
    await api.post(`/found-items/${createdItem.id}/images`, formData);
  }
  return createdItem;
};

export const updateFoundItem = (id, data) => api.put(`/found-items/${id}`, data);
export const deleteFoundItem = (id) => api.delete(`/found-items/${id}`);
export const getFoundItem = (id) => api.get(`/public/found-items/${id}`);
export const getMyFoundItems = (page = 0, size = 10) => api.get(`/found-items/my-items?page=${page}&size=${size}`);
export const getAllFoundItems = (page = 0, size = 10, params) => api.get('/public/found-items', { params: { page, size, ...params } });
export const uploadFoundItemImages = (id, files) => {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  return api.post(`/found-items/${id}/images`, formData);
};
