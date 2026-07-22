import { 
  createPostService, 
  getAllPostsService, 
  getPostByIdService 
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