import api from './axiosConfig';

export const getProfile = () => api.get('/users/profile');

export const updateProfile = (data) => api.put('/users/profile', data);

export const changePassword = (data) => api.post('/users/change-password', data);

export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deactivateAccount = () => api.post('/users/deactivate');
