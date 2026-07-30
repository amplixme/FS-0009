import api from './api';

export const getAll = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al obtener las categorías', { cause: error });
  }
};

export const create = async (data) => {
  try {
    const response = await api.post('/categories', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al crear la categoría', { cause: error });
  }
};

export const update = async (id, data) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al actualizar la categoría', { cause: error });
  }
};

export const remove = async (id) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al eliminar la categoría', { cause: error });
  }
};