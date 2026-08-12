import { Router } from 'express';
import authRouter from './auth.routes.js';
import postRoutes from './post.routes.js';
import commentRoutes from "./comment.routes.js";
import categoryRoutes from './category.routes.js';
import uploadRoutes from './upload.routes.js';
import adminRoutes from './admin.routes.js';


const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Registrar rutas de auth
router.use('/auth', authRouter);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);
router.use("/",commentRoutes);
router.use('/admin', adminRoutes);

// ──────────────────────────────────────────────
//  Cómo agregar una nueva ruta:
//
//  1. Crear el archivo en routes/ (ej: post.routes.js)
//  2. Importarlo acá:
//       import postRouter from './post.routes.js';
//  3. Montarlo con su prefijo:
//       router.use('/posts', postRouter);
//
//  Ejemplo:
//       import postRouter from './post.routes.js';
//       router.use('/posts', postRouter);
// ──────────────────────────────────────────────

export default router;
