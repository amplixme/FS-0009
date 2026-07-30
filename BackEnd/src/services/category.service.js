import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Obtener todas las categorías
export const getAllCategoriesService = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return categories;
};

// Obtener una categoría por su ID
export const getCategoryByIdService = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return category;
};

// Crear categoría
export const createCategoryService = async ({ name, slug }) => {
  const newCategory = await prisma.category.create({
    data: {
      name,
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return newCategory;
};

// Actualizar categoría
export const updateCategoryService = async (id, { name, slug }) => {
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: { name, slug },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return updatedCategory;
};

// Eliminar categoría
export const deleteCategoryService = async (id) => {
  await prisma.category.delete({
    where: { id },
  });
};

// Obtener cantidad de posts asociados a una categoría
export const getCategoryPostsCountService = async (id) => {
  const count = await prisma.category.findUnique({
    where: { id },
    select: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return count?._count.posts ?? 0;
};
