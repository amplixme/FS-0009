import { Router } from 'express';
import { create, getAll, getById} from '../controllers/post.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js'; 
import { createPostSchema } from '../schema/post.schema.js';

const router = Router();

// rutas publicas
router.get('/', getAll);
router.get('/:id', getById);

// ruta protegida
router.post('/', authMiddleware, validate(createPostSchema), create);



export default router;