import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema } from '../schema/auth.schema.js';

const router = Router();

// Este es un controlador de prueba temporal para validar el funcionamiento
router.post('/register', validate(registerSchema), (req, res) => {
  res.status(201).json({
    message: 'Usuario validado con éxito',
    user: req.body
  });
});

export default router;