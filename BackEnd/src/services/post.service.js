import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Crear post
export const createPostService = async ({ title, content, coverImage, authorId, published, categoryIds }) => {
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      published,
      coverImage,
      authorId,
      // Vincula las categorías si vienen en la petición
      ...(categoryIds && categoryIds.length > 0 && {
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
      }),
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
    },
  });

  return newPost;
};

// Obtener todos los post con paginación, ordenamiento, filtro por categoría y BÚSQUEDA
export const getAllPostsService = async (queryParams = {}) => {
  // 1. Extraer y parsear parámetros con sus valores por defecto
  const page = Math.max(1, Number(queryParams.page) || 1);
  const limit = Math.max(1, Number(queryParams.limit) || 10);
  const sort = queryParams.sort || "newest";
  const categorySlug = queryParams.category;
  const search = queryParams.search; // 👈 🎯 Extraemos el query param search

  // 2. Calcular elementos a saltar
  const skip = (page - 1) * limit;

  // 3. Configurar filtro de la consulta
  const where = {
    published: true,
  };

  // Filtro por categoría (si viene en la query)
  if (categorySlug) {
    where.categories = {
      some: {
        slug: categorySlug,
      },
    };
  }

  // 🎯 Búsqueda case-insensitive en título o contenido (FS0009-54)
  if (search && search.trim() !== "") {
    const searchTerm = search.trim();
    where.OR = [
      {
        title: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  // 4. Configurar ordenamiento según query params: newest | oldest | comments
  let orderBy = { createdAt: "desc" };

  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sort === "comments") {
    orderBy = {
      comments: {
        _count: "desc",
      },
    };
  }

  // 5. Consultas a la base de datos en paralelo
  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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
    }),
  ]);

  // 6. Formatear lista de publicaciones
  const formattedPosts = posts.map((post) => ({
    ...post,
    commentCount: post._count.comments,
  }));

  // 7. Calcular total de páginas
  const totalPages = Math.ceil(total / limit);

  return {
    data: formattedPosts,
    total,
    page,
    totalPages,
  };
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
export const updatePostService = async (id, { title, content, coverImage, published, categoryIds }) => { 
  const updatedPost = await prisma.post.update({
    where: { id: Number(id) },
    data: { 
      title, 
      content, 
      coverImage, 
      published,
      // Reemplaza las categorías vinculadas si vienen en la petición
      ...(categoryIds && {
        categories: {
          set: categoryIds.map((id) => ({ id })),
        },
      }),
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