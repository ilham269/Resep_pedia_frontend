import api from './api';

export const recipeService = {
  getAll: (params) => api.get('/recipes', { params }),
  getBySlug: (slug) => api.get(`/recipes/${slug}`),
  getFeatured: () => api.get('/recipes/featured'),
  getTrending: () => api.get('/recipes/trending'),
  search: (q, params) => api.get('/recipes/search', { params: { q, ...params } }),
  create: (data) => api.post('/recipes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/recipes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/recipes/${id}`),
  save: (id) => api.post(`/recipes/${id}/save`),
  unsave: (id) => api.delete(`/recipes/${id}/save`),
  submitRating: (id, data) => api.post(`/recipes/${id}/rating`, data),
  getRatings: (id, params) => api.get(`/recipes/${id}/ratings`, { params }),
  getCategories: () => api.get('/categories'),
  getRegions: () => api.get('/regions'),
  getCountries: () => api.get('/countries'),
  getTags: () => api.get('/tags'),
};
