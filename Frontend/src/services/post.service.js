import api from './api';

export const getAll = async (categorySlug) => {
  try {
    const response = await api.get('/posts', {
      params: categorySlug ? { category: categorySlug } : {},
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al obtener los posts', { cause: error });
  }
};

export const getById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al obtener el post', { cause: error });
  }
};

export const create = async (data) => {
  try {
    const response = await api.post('/posts', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al crear el post', { cause: error });
  }
};

export const update = async (id, data) => {
  try {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al actualizar el post', { cause: error });
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al eliminar el post', { cause: error });
  }
};