import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Obtener perfil público de un usuario por ID
 */
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      name: true,
      bio: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  return {
    id: user.id,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    postsCount: user._count.posts,
  };
};

/**
 * Actualizar perfil propio
 */
export const updateUserProfile = async (userId, data) => {
  const { name, bio, avatarUrl } = data;

  const updatedUser = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      avatarUrl: true,
      role: true,
    },
  });

  return updatedUser;
};