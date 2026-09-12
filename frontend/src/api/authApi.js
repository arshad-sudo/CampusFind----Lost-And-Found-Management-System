import api from './axiosConfig';

export const login = (email, password) => {
  return api.post('/auth/login', { email, password });
};

export const register = (data) => {
  return api.post('/auth/register', data);
};

export const forgotPassword = (email) => {
  return api.post('/auth/forgot-password', { email });
};

export const resetPassword = (data) => {
  return api.post('/auth/reset-password', data);
};
