import { Router } from "express";
import {
  getAll,
  create,
  update,
  remove,
} from "../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import requireRole from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schema/category.schema.js";

const router = Router();

// Ruta pública: listar categorías
router.get("/", getAll);

// Rutas protegidas (solo ADMIN)
router.post(
  "/",
  authMiddleware,
  requireRole("ADMIN"),
  validate(createCategorySchema),
  create
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  validate(updateCategorySchema),
  update
);

router.delete("/:id", authMiddleware, requireRole("ADMIN"), remove);

export default router;
