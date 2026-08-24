import api from './api';

export const getByPostId = async (postId) => {
  try {
    const { data } = await api.get(`/posts/${postId}/comments`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al obtener los comentarios', {
      cause: error,
    });
  }
};

export const create = async (postId, content) => {
  try {
    const { data } = await api.post(`/posts/${postId}/comments`, { content });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al crear el comentario', {
      cause: error,
    });
  }
};

export const update = async (id, content) => {
  try {
    const { data } = await api.put(`/comments/${id}`, { content });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al actualizar el comentario', {
      cause: error,
    });
  }
};

export const deleteComment = async (id) => {
  try {
    await api.delete(`/comments/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al eliminar el comentario', {
      cause: error,
    });
  }
};
