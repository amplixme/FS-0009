import api from './api';

export const getProfile = async (id) => {
    try{
        const response = await api.get(`/users/${id}`);
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.error?.message || 'Error al obtener los datos del perfil', { cause: error });
    }
}

export const updateProfile = async (data) => {
    try {
        const response = await api.put(`/users/me`,data)
        return response.data
    } catch (error) {
         throw new Error(error.response?.data?.error?.message || 'Error al actualizar los datos del perfil', { cause: error });
    }
}

const userService = {
  getProfile,updateProfile
};

export default userService;