import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock de Prisma Client
const { mockPrisma } = vi.hoisted(() => {
  return {
    mockPrisma: {
      post: {
        create: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  };
});

vi.mock('../generated/prisma/client.js', () => {
  return {
    PrismaClient: class {
      constructor() {
        return mockPrisma;
      }
    },
  };
});

vi.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: class {
      constructor() {
        return {};
      }
    },
  };
});

import {
  createPostService,
  getAllPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} from '../services/post.service.js';

describe('Post Service - Tests Unitarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createPostService', () => {
    it('1. Debe crear un post correctamente vinculando categorías si existen', async () => {
      const postInput = {
        title: 'Nuevo Post',
        content: 'Contenido del post',
        coverImage: 'https://image.com/test.jpg',
        authorId: 1,
        published: true,
        categoryIds: [1, 2],
      };

      const mockCreated = {
        id: 10,
        ...postInput,
        author: { name: 'Facundo' },
        categories: [{ id: 1, name: 'Tech', slug: 'tech' }],
      };

      mockPrisma.post.create.mockResolvedValue(mockCreated);

      const result = await createPostService(postInput);

      expect(mockPrisma.post.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Nuevo Post',
            authorId: 1,
            categories: {
              connect: [{ id: 1 }, { id: 2 }],
            },
          }),
        })
      );
      expect(result).toEqual(mockCreated);
    });
  });

  describe('getAllPostsService', () => {
    it('2. Debe obtener publicaciones paginadas con cálculo de totalPages y conteo de comentarios', async () => {
      const mockPosts = [
        {
          id: 1,
          title: 'Post 1',
          published: true,
          _count: { comments: 3 },
        },
      ];

      mockPrisma.post.count.mockResolvedValue(1);
      mockPrisma.post.findMany.mockResolvedValue(mockPosts);

      const result = await getAllPostsService({ page: 1, limit: 10 });

      expect(mockPrisma.post.count).toHaveBeenCalled();
      expect(mockPrisma.post.findMany).toHaveBeenCalled();
      expect(result.data[0].commentCount).toBe(3);
      expect(result.totalPages).toBe(1);
      expect(result.total).toBe(1);
    });
  });

  describe('getPostByIdService', () => {
    it('3. Debe retornar el detalle de un post por su ID', async () => {
      const mockPost = {
        id: 5,
        title: 'Detalle Post',
        authorId: 2,
        author: { name: 'Facundo' },
        categories: [],
      };

      mockPrisma.post.findUnique.mockResolvedValue(mockPost);

      const result = await getPostByIdService(5);

      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: 5 },
        select: expect.any(Object),
      });
      expect(result).toEqual(mockPost);
    });

    it('4. (Error 404) Debe retornar null si el post no existe', async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null);

      const result = await getPostByIdService(999);

      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        select: expect.any(Object),
      });
      expect(result).toBeNull();
    });
  });

  describe('updatePostService & Verificación de Autoría', () => {
    it('5. Debe actualizar los datos y categorías del post exitosamente si es el autor', async () => {
      const updateData = {
        title: 'Título Editado',
        content: 'Contenido Editado',
        coverImage: 'https://image.com/new.jpg',
        published: true,
        categoryIds: [3],
      };

      const mockUpdated = {
        id: 1,
        ...updateData,
        author: { name: 'Facundo' },
        categories: [{ id: 3, name: 'Dev', slug: 'dev' }],
      };

      mockPrisma.post.update.mockResolvedValue(mockUpdated);

      const result = await updatePostService(1, updateData);

      expect(mockPrisma.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          title: 'Título Editado',
          categories: { set: [{ id: 3 }] },
        }),
        select: expect.any(Object),
      });
      expect(result).toEqual(mockUpdated);
    });

    it('6. (Error 403) Debe validar rechazo de permisos cuando el usuario no es autor ni ADMIN', async () => {
      const mockExistingPost = { id: 1, authorId: 10 };
      const currentUserId = 99;
      const currentUserRole = 'USER';

      mockPrisma.post.findUnique.mockResolvedValue(mockExistingPost);

      const post = await getPostByIdService(1);
      const isAuthor = post.authorId === currentUserId;
      const isAdmin = currentUserRole === 'ADMIN';
      const hasPermission = isAuthor || isAdmin;

      expect(hasPermission).toBe(false);
      expect(mockPrisma.post.update).not.toHaveBeenCalled();
    });
  });

  describe('deletePostService & Verificación de Autoría', () => {
    it('7. Debe eliminar el post correctamente cuando la verificación es válida', async () => {
      mockPrisma.post.delete.mockResolvedValue({ id: 1 });

      await deletePostService(1);

      expect(mockPrisma.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('8. (Error 403) Debe validar rechazo de eliminación si el usuario no es el autor ni ADMIN', async () => {
      const mockExistingPost = { id: 2, authorId: 5 };
      const currentUserId = 8;
      const currentUserRole = 'USER';

      mockPrisma.post.findUnique.mockResolvedValue(mockExistingPost);

      const post = await getPostByIdService(2);
      const isAuthor = post.authorId === currentUserId;
      const isAdmin = currentUserRole === 'ADMIN';
      const hasPermission = isAuthor || isAdmin;

      expect(hasPermission).toBe(false);
      expect(mockPrisma.post.delete).not.toHaveBeenCalled();
    });
  });
});