import api from './api';

export const getStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al obtener las estadísticas', { cause: error });
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al obtener los usuarios', { cause: error });
  }
};

export const createUser = async (data) => {
  try {
    const response = await api.post('/admin/users', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al crear el usuario', { cause: error });
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al cambiar el rol', { cause: error });
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al editar el usuario', { cause: error });
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al eliminar el usuario', { cause: error });
  }
};

export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/admin/posts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al eliminar el post', { cause: error });
  }
};

export const deleteComment = async (id) => {
  try {
    const response = await api.delete(`/admin/comments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al eliminar el comentario', { cause: error });
  }
};

export const getAllComments = async () => {
  try {
    const response = await api.get('/admin/comments');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al obtener los comentarios', { cause: error });
  }
};