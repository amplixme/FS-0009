import { Router } from 'express';
import authRouter from './auth.routes.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Registrar rutas de auth
router.use('/auth', authRouter);

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
