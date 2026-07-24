import { 
  createPostService, 
  getAllPostsService, 
  getPostByIdService,
  updatePostService,
  deletePostService,
} from '../services/post.service.js';

export const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    
    const authorId = req.user.id; 

    const newPost = await createPostService({ title, content, authorId });

  return res.status(201).json(newPost);

  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const posts = await getAllPostsService();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostByIdService(id);

    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // 1. Verificar si el post existe
    const post = await getPostByIdService(id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // 2. Verificar autoría u 'ADMIN'
    const isAuthor = post.authorId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        error: { message: 'No tienes permiso para modificar este post' },
      });
    }

    const updatedPost = await updatePostService(id, { title, content });
    return res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Verificar si el post existe
    const post = await getPostByIdService(id);
    if (!post) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    // 2. Verificar autoría u 'ADMIN'
    const isAuthor = post.authorId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        error: { message: 'No tienes permiso para modificar este post' },
      });
    }

    await deletePostService(id);
    return res.status(200).json({ message: 'Post eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};