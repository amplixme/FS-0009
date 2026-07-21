import { Router } from 'express';
import { create } from '../controllers/post.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js'; 
import { createPostSchema } from '../schema/post.schema.js';

const router = Router();

// Endpoints
router.post('/', authMiddleware, validate(createPostSchema), create);

export default router;