import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js'; 
import { createCommentSchema } from "../schema/comment.schema.js";
import { updateCommentSchema } from '../schema/comment.schema.js';
import {createComment, getCommentsByPostId, updateComment, deleteComment} from '../controllers/comment.controller.js';

const router = Router();

router.post("/posts/:postId/comments", authMiddleware, validate(createCommentSchema),createComment);
router.get("/posts/:postId/comments", getCommentsByPostId);
router.put("/comments/:id", authMiddleware, validate(updateCommentSchema), updateComment);
router.delete("/comments/:id", authMiddleware, deleteComment);

export default router;