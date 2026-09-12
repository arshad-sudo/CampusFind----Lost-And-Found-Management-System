import api from './axiosConfig';

export const createLostItem = async (data, images) => {
  const res = await api.post('/lost-items', data);
  const createdItem = res?.data || res;
  if (images && images.length > 0 && createdItem?.id) {
    const formData = new FormData();
    images.forEach(img => {
      if (img) formData.append('files', img);
    });
    await api.post(`/lost-items/${createdItem.id}/images`, formData);
  }
  return createdItem;
};

export const updateLostItem = (id, data) => api.put(`/lost-items/${id}`, data);
export const deleteLostItem = (id) => api.delete(`/lost-items/${id}`);
export const getLostItem = (id) => api.get(`/public/lost-items/${id}`);
export const getMyLostItems = (page = 0, size = 10) => api.get(`/lost-items/my-items?page=${page}&size=${size}`);
export const getAllLostItems = (page = 0, size = 10, params) => api.get('/public/lost-items', { params: { page, size, ...params } });
export const uploadLostItemImages = (id, files) => {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  return api.post(`/lost-items/${id}/images`, formData);
};
