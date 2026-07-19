import dotenv from 'dotenv';
import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../schema/auth.schema.js';
import { register, login } from '../controllers/auth.controller.js';

dotenv.config();

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;