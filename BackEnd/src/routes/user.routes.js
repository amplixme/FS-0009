import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router = Router();

// PUT /api/users/me -> Protegido (Actualizar propio perfil)
router.put("/me", authMiddleware, updateProfile);

// GET /api/users/:id -> Público (Perfil público de un usuario)
router.get("/:id", getProfile);

export default router;