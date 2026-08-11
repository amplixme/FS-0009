import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Crear post
export const createPostService = async ({ title, content, coverImage, authorId, published}) => {
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      published,
      coverImage,
      authorId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      coverImage: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return newPost;
};

// Obtener todos los post (con filtro opcional por slug de categoría)
export const getAllPostsService = async (categorySlug) => {
  const where = {
    published: true,
  };

  if (categorySlug) {
    where.categories = {
      some: {
        slug: categorySlug,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      content: true,
      coverImage: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    ...post,
    commentCount: post._count.comments,
  }));
};

// Obtener un post por su ID
export const getPostByIdService = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      title: true,
      content: true,
      coverImage: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      author: {
        select: {
          name: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return post;
};

// Actualizar post
export const updatePostService = async (id, { title, content, coverImage, published }) => { 
  const updatedPost = await prisma.post.update({
    where: { id: Number(id) },
    data: { title, content, coverImage, published },
    select: {
      id: true,
      title: true,
      content: true,
      coverImage: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return updatedPost;
};

// Eliminar post
export const deletePostService = async (id) => {
  await prisma.post.delete({
    where: { id: Number(id) },
  });
};