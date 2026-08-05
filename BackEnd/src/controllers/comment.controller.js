import {createCommentService,
   getCommentsByPostIdService,
   getCommentByIdService,
   updateCommentService,
   deleteCommentService,
} from '../services/comment.service.js';
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


export const updateComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { content } = req.body;

    const comment = await getCommentByIdService(id);

    // 1. Si no existe -> 404
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // 2. Ownership check (solo autor) -> 403
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const updated = await updateCommentService(id, { content });
    return res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const comment = await getCommentByIdService(id);

    // 1. Si no existe -> 404
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // 2. Control de permisos: Elimina autor O ADMIN
    const isOwner = comment.authorId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await deleteCommentService(id);
    return res.status(200).json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};