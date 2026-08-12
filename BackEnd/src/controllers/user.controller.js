import * as userService from "../services/user.service.js";

/**
 * GET /api/users/:id - Perfil público (name, bio, avatar, conteo de posts)
 */
export const getProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await userService.getUserProfile(id);
    return res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/me - Actualizar propio perfil (name, bio, avatarUrl)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const { name, bio, avatarUrl } = req.body;

    const updatedUser = await userService.updateUserProfile(userId, {
      name,
      bio,
      avatarUrl,
    });

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};