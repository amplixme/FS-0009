import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Crear comentario en el post
export const createCommentService = async ({ content,postId,authorId }) => {
  const newComment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId,
    },
    select: {
      id: true,
      content: true,
      postId: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,

     post: {
        select: {
          title: true,
        },
      },      

      author: {
        select: {
          name: true,
        },
      }
    },
  });

  return newComment;
};

// Obtener comentarios de un post
export const getCommentsByPostIdService = async (postId) => {
  const comments = await prisma.comment.findMany({
    where: { postId: Number(postId) },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      content: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return comments;
};

// Buscar comentario por ID
export const getCommentByIdService = async (id) => {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(id) },
  });
  return comment;
};

// Actualizar comentario
export const updateCommentService = async (id, data) => {
  const updatedComment = await prisma.comment.update({
    where: { id: Number(id) },
    data: {
      content: data.content,
    },
    select: {
      id: true,
      content: true,
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
  return updatedComment;
};

// Eliminar comentario
export const deleteCommentService = async (id) => {
  await prisma.comment.delete({
    where: { id: Number(id) },
  });
  return true;
};