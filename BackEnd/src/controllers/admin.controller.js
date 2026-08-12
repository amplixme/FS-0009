import {
  getStatsService,
  getAllUsersService,
  createUserService,
  updateUserRoleService,
  updateUserService,
  deleteUserService,
  deletePostService,
  deleteCommentService,
} from "../services/admin.service.js";

// GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const stats = await getStatsService();
    return res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await createUserService({ name, email, password, role });
    return res.status(201).json(newUser);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: { message: "Ya existe un usuario con ese email" },
      });
    }
    next(error);
  }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // No puede cambiar su propio rol
    if (Number(id) === req.user.id) {
      return res.status(403).json({
        error: { message: "No podés cambiar tu propio rol" },
      });
    }

    const updatedUser = await updateUserRoleService(id, role);
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const updatedUser = await updateUserService(id, { name, email, role });
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: { message: "Ya existe un usuario con ese email" },
      });
    }
    next(error);
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // No puede eliminarse a sí mismo
    if (Number(id) === req.user.id) {
      return res.status(403).json({
        error: { message: "No podés eliminar tu propia cuenta" },
      });
    }

    await deleteUserService(id);
    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/posts/:id
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deletePostService(id);
    return res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/comments/:id
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCommentService(id);
    return res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};