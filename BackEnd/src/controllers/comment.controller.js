import {createCommentService, getCommentsByPostIdService} from '../services/comment.service.js';
import { getPostByIdService } from '../services/post.service.js';

export const createComment = async (req, res, next) => {
  try {
    
    const authorId = req.user.id;
    const authorName = req.user.name;
    const { content } = req.body;
    
    const postId = parseInt(req.params.postId);

    const findPost = await getPostByIdService(postId);

    if (!findPost){
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const newComment = await createCommentService({ content, postId, authorId});
  return res.status(201).json({
    autor: authorName,
    comentario: newComment.content});

  } catch (error) {
    next(error);
  }
};

export const getCommentsByPostId = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    // Validar si el post existe
    const findPost = await getPostByIdService(postId);
    if (!findPost) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // Obtener los comentarios
    const comments = await getCommentsByPostIdService(postId);

    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};