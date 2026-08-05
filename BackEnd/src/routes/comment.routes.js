import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js'; 
import { createCommentSchema } from "../schema/comment.schema.js";

import {createComment, getCommentsByPostId} from '../controllers/comment.controller.js';

const router = Router();

router.post("/:postId/comments", authMiddleware, validate(createCommentSchema),createComment);
router.get("/:postId/comments", getCommentsByPostId);

export default router;