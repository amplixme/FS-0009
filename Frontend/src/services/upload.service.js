import api from './api';

export const uploadImage = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data.url;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Error al subir la imagen', { cause: error });
  }
};