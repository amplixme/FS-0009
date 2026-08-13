import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";
import {
  getStats,
  getAllUsers,
  createUser,
  updateUserRole,
  updateUser,
  deleteUser,
  deletePost,
  deleteComment,
} from "../controllers/admin.controller.js";

const router = Router();

// Todas las rutas requieren estar autenticado y tener rol ADMIN
router.use(authMiddleware, requireRole("ADMIN"));

router.get("/stats", getStats);

router.get("/users", getAllUsers);
router.post("/users", createUser);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.delete("/posts/:id", deletePost);

router.delete("/comments/:id", deleteComment);

export default router;