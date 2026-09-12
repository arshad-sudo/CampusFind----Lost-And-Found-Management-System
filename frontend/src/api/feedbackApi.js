import api from './axiosConfig';

export const submitFeedback = (data) => api.post('/feedback', data);
