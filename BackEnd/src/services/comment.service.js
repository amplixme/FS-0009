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