import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Crear post
export const createPostService = async ({ title, content, coverImage, authorId }) => {
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
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

// Obtener todos los post
export const getAllPostsService = async () => {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
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
    },
  });

  return posts;
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
    },
  });

  return post;
};

// Actualizar post
export const updatePostService = async (id, { title, content, coverImage }) => { 
  const updatedPost = await prisma.post.update({
    where: { id: Number(id) },
    data: { title, content, coverImage },
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

  return updatedPost;
};

// Eliminar post
export const deletePostService = async (id) => {
  await prisma.post.delete({
    where: { id: Number(id) },
  });
};