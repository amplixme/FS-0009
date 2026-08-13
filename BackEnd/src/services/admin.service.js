import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Obtener estadísticas generales del sistema
export const getStatsService = async () => {
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const totalComments = await prisma.comment.count();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const postsToday = await prisma.post.count({
    where: { createdAt: { gte: startOfToday } },
  });

  const postsByCategory = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  return {
    totalUsers,
    totalPosts,
    totalComments,
    postsToday,
    postsByCategory: postsByCategory.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      postCount: cat._count.posts,
    })),
  };
};

// Obtener todos los usuarios con cantidad de posts
export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    postCount: user._count.posts,
  }));
};

// Crear usuario desde el panel de admin (puede asignar rol directamente)
export const createUserService = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return newUser;
  } catch (error) {
    if (error.code === "P2002") {
      error.meta = { target: "email" };
    }
    throw error;
  }
};

// Cambiar el rol de un usuario (USER <-> ADMIN)
export const updateUserRoleService = async (id, role) => {
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return updatedUser;
};

// Editar datos de cualquier usuario (name, email, role)
export const updateUserService = async (id, { name, email, role }) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return updatedUser;
  } catch (error) {
    if (error.code === "P2002") {
      error.meta = { target: "email" };
    }
    throw error;
  }
};

// Eliminar usuario (posts y comentarios se borran en cascada por el schema)
export const deleteUserService = async (id) => {
  await prisma.user.delete({
    where: { id: Number(id) },
  });
};

// Eliminar cualquier post (admin bypassa el ownership check del controller normal)
export const deletePostService = async (id) => {
  await prisma.post.delete({
    where: { id: Number(id) },
  });
};

// Eliminar cualquier comentario
export const deleteCommentService = async (id) => {
  await prisma.comment.delete({
    where: { id: Number(id) },
  });
};

// Obtener los comentarios más recientes de todo el sitio
export const getAllCommentsService = async () => {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: { name: true },
      },
      post: {
        select: { id: true, title: true },
      },
    },
  });

  return comments;
};