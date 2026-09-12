import api from './axiosConfig';

export const submitClaim = (data, proofImage) => {
  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (proofImage) {
    formData.append('proofImage', proofImage);
  }
  return api.post('/claims', formData);
};

export const getMyClaims = (page = 0, size = 10) => api.get(`/claims/my-claims?page=${page}&size=${size}`);
export const cancelClaim = (id) => api.put(`/claims/${id}/cancel`);
