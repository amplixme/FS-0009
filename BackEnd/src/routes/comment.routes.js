import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js'; 
import { createCommentSchema } from "../schema/comment.schema.js";

import { createComment } from '../controllers/comment.controller.js';

const router = Router();

router.post("/:postId/comments", authMiddleware, validate(createCommentSchema),createComment);

export default router;